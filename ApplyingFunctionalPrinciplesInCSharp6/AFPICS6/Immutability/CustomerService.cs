namespace Immutability;

/// <summary>
/// This class suffers from temporal coupling - the order of the methods is important
/// 1. Lift all dependencies and side effects to the signature level
/// 
/// </summary>
public class CustomerService
{
    private Address _address;
    private Customer _customer;

    public void Process(string customerName, string addressString)
    {
        // 
        CreateAddress(addressString);
        CreateCustomer(customerName);
        SaveCustomer();
    }

    // signature hides Address invocation
    /*private void CreateAddress(string addressString)
    {
        // not good
        _address = new Address(addressString);
    }*/

    // better - signature makes more sense
    private Address CreateAddress(string addressString)
    {
        return new Address(addressString);
    }

    private void CreateCustomer(string customerName)
    {
        _customer = new Customer(customerName, _address);
    }

    private void SaveCustomer()
    {
        var repository = new Repository();
        repository.Save(_customer);
    }
}