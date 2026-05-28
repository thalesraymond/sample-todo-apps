using System.Collections.Concurrent;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<string, User> _users = new();
    private readonly ConcurrentDictionary<string, string> _emailToId = new();
    private readonly ConcurrentDictionary<string, string> _idToEmail = new();

    public void AddUser(User user)
    {
        _users[user.Id] = user;

        // Remove old email index if it changed
        if (_idToEmail.TryGetValue(user.Id, out var oldEmail) && oldEmail != user.Email)
        {
            _emailToId.TryRemove(oldEmail, out _);
        }

        _idToEmail[user.Id] = user.Email;
        _emailToId[user.Email] = user.Id;
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
