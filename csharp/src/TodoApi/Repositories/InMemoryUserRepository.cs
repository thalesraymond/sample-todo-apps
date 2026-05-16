using System.Collections.Concurrent;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<string, User> _users = new();
    private readonly ConcurrentDictionary<string, User> _usersByEmail = new();

    public void AddUser(User user)
    {
        _users[user.Id] = user;
        if (user.Email != null)
        {
            _usersByEmail[user.Email] = user;
        }
    }

    public User? GetUserByEmail(string email)
    {
        if (email == null) return null;
        _usersByEmail.TryGetValue(email, out var user);
        return user;
    }

    public User? GetUserById(string id)
    {
        if (id == null) return null;
        _users.TryGetValue(id, out var user);
        return user;
    }
}
