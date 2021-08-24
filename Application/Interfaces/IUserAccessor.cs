namespace Application.Interfaces
{
    public interface IUserAccessor
    {
        //because our application project does not have a dependency on the infrastructure
        // project, then we'regoing to be able to access this class via an interface.
        string GetUsername();
    }
}