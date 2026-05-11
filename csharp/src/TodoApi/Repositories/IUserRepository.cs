using TodoApi.Models;

namespace TodoApi.Repositories;

public interface IUserRepository
{
    User? GetUserByEmail(string email);
    User? GetUserById(string id);
    void AddUser(User user);
}
