using System.Collections.Concurrent;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<string, User> _users = new();
    private readonly ConcurrentDictionary<string, string> _emailToId = new();
    private readonly ConcurrentDictionary<string, string> _idToEmail = new();
    private readonly object _lock = new();

    public void AddUser(User user)
    {
        lock (_lock)
        {
            _users[user.Id] = user;

            // Remove old email index if it changed and still points to this user
            if (_idToEmail.TryGetValue(user.Id, out var oldEmail) && oldEmail != user.Email)
            {
                if (_emailToId.TryGetValue(oldEmail, out var existingId) && existingId == user.Id)
                {
                    _emailToId.TryRemove(oldEmail, out _);
                }
            }

            _idToEmail[user.Id] = user.Email;
            _emailToId[user.Email] = user.Id;
        }
    }

    public User? GetUserByEmail(string email)
    {
        if (_emailToId.TryGetValue(email, out var id))
        {
            _users.TryGetValue(id, out var user);
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
