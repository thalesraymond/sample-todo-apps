using System.Collections.Concurrent;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<string, User> _users = new();
    private readonly ConcurrentDictionary<string, string> _emailToUserId = new();
    private readonly ConcurrentDictionary<string, string> _knownEmailForUser = new();

    public void AddUser(User user)
    {
        _users[user.Id] = user;

        if (_knownEmailForUser.TryGetValue(user.Id, out var oldEmail))
        {
            if (oldEmail != user.Email)
            {
                _emailToUserId.TryRemove(oldEmail, out _);
            }
        }

        _knownEmailForUser[user.Id] = user.Email;
        _emailToUserId[user.Email] = user.Id;
    }

    public User? GetUserByEmail(string email)
    {
        if (_emailToUserId.TryGetValue(email, out var userId))
        {
            _users.TryGetValue(userId, out var user);
            return user;
        }
        return null;
    }

    public User? GetUserById(string id)
    {
        _users.TryGetValue(id, out var user);
        return user;
    }
}
