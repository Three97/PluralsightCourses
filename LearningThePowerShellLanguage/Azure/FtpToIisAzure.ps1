# 12/12/2022 JPF updates toward MS example https://learn.microsoft.com/en-us/azure/app-service/scripts/powershell-deploy-ftp?toc=%2Fpowershell%2Fmodule%2Ftoc.json
function Upload-FTPS($Url, $Username, $Password, $SourceFilePath) {
	function PushFile($ftp, $file) {
		$content = [System.IO.File]::ReadAllBytes($file)
		$ftp.ContentLength = $content.Length
		Write-Host "DEBUG: File is ["$content.Length"] bytes long"
		
		Write-Host "DEBUG: FTP properties:"$ftp | format-list

		$rs = $ftp.GetRequestStream()
		
		try {
			$rs.Write($content, 0, $content.Length)
			Write-Host "DEBUG: Successfully sent file via FTP"
		} finally {
      if ($null -ne $rs) {
				Write-Host "DEBUG: Cleaning up resources..."
        $rs.Close()
        $rs.Dispose()
      }
		}
	}
	
	# [System.Net.FtpWebRequest]::Create doesn't support the ftps protocol prefix, setting EnableSSL down below accomplishes it though
	$Url = $Url -replace "ftps://", "ftp://"
	$Uri = New-Object System.Uri($Url)
	$ftp = [System.Net.FtpWebRequest]([System.Net.WebRequest]::Create($Uri))
	$ftp.UsePassive=$true
	$ftp.UseBinary=$true
	$ftp.EnableSsl=$true
	$ftp.KeepAlive=$true
	$ftp.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
	$ftp.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
	
	PushFile $ftp $SourceFilePath
}

$resourceGroup = "dev-us0-app-tier" # "#{AzureResourceGroupAppTier}"
$subscriptionId = "3f126764-9889-4f98-a824-102687d56b1f"  # "#{AzureSubscriptionId}"
$appName = "dev-us0-inreach-internal" # "#{CloudServicePrefix}-#{CloudRegionPrefix}-inreach-internal"
$appSlotName = "staging" # "#{DeploySlot}"
Write-Host "Logging in and setting subscriptionId to [$subscriptionId]"
#az login --service-principal -u $OctopusAzureADClientId -p $OctopusAzureADPassword --tenant $OctopusAzureADTenantId
az account set --subscription $subscriptionId

Write-Host "Querying Azure to determine FTP publish profile for app name [$appName] and slot [$appSlotName] in resource group [$resourceGroup]."

$publishProfile = az webapp deployment list-publishing-profiles --resource-group $resourceGroup --name $appName --slot $appSlotName --query "[?ends_with(profileName, 'internal-staging - FTP')].{userName: userName, userPWD: userPWD, profileName: profileName, publishUrl: publishUrl}" | ConvertFrom-Json
# Write-Host "Publish Profile: " $publishProfile

$ftpEndpoint = $publishProfile.publishUrl
$ftpUsername = $publishProfile.userName
$ftpPassword = $publishProfile.userPWD

Write-Host "Found FTP endpoint [$ftpEndpoint] with username [$ftpUsername]"

# We want to copy applicationHost.xdt one level up from site/wwwroot for kudu to pick it up and apply it to IIS
$appInternalServicesPackageDir = "" # $OctopusParameters["Octopus.Action.Package[AppInternalServices].ExtractedPath"]
$fileToFtp = "c:\jpftemp\applicationHost.xdt" # $appInternalServicesPackageDir + "/Deploy/applicationHost.xdt"
$ftpEndpointNoWWWRoot = $ftpEndpoint -replace ".{8}$"
$ftpEndpointApplicationHost = $ftpEndpointNoWWWRoot + "/applicationHost.xdt"
$ftpDirectoryTemp = "site"

Write-Host "FTPing [$fileToFtp] to [$ftpEndpointApplicationHost]..."

# Send-FtpFile -site "waws-prod-bn1-045.ftp.azurewebsites.windows.net" -user $ftpUsername -password $ftpPassword -ftpdirectory $ftpDirectoryTemp -FtpFileName $fileToFtp
# az webapp deploy --resource-group $resourceGroup --name $appName --src-path $ftpEndpointApplicationHost --type=static
Upload-FTPS -Url $ftpEndpointApplicationHost -Username $ftpUsername -Password $ftpPassword -SourceFilePath $fileToFtp