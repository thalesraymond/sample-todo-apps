using System.Collections.Concurrent;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<string, User> _users = new();

    public void AddUser(User user)
    {
        _users[user.Id] = user;
    }

    public User? GetUserByEmail(string email)
    {
        return _users.Values.FirstOrDefault(u => u.Email == email);
    }

    public User? GetUserById(string id)
    {
        _users.TryGetValue(id, out var user);
        return user;
    }
}
