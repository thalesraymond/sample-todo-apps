using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;

namespace TodoApi.Tests;

public class CorsTests
{
    [Fact]
    public async Task Cors_WithSpecificOrigin_ReturnsAccessControlAllowOriginHeader()
    {
        var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseSetting("CORS_ORIGIN", "http://trusted.com");
        });

        var client = factory.CreateClient();

        var request = new HttpRequestMessage(HttpMethod.Options, "/api/auth/login");
        request.Headers.Add("Origin", "http://trusted.com");
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await client.SendAsync(request);

        response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values).Should().BeTrue();
        values.Should().Contain("http://trusted.com");
    }

    [Fact]
    public async Task Cors_WithSpecificOrigins_SupportsMultiple()
    {
        var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseSetting("CORS_ORIGIN", "http://trusted.com,http://othertrusted.com");
        });

        var client = factory.CreateClient();

        var request = new HttpRequestMessage(HttpMethod.Options, "/api/auth/login");
        request.Headers.Add("Origin", "http://othertrusted.com");
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await client.SendAsync(request);

        response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values).Should().BeTrue();
        values.Should().Contain("http://othertrusted.com");
    }

    [Fact]
    public async Task Cors_WithDisallowedOrigin_DoesNotReturnAccessControlAllowOriginHeader()
    {
        var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseSetting("CORS_ORIGIN", "http://trusted.com");
        });

        var client = factory.CreateClient();

        var request = new HttpRequestMessage(HttpMethod.Options, "/api/auth/login");
        request.Headers.Add("Origin", "http://evil.com");
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await client.SendAsync(request);

        response.Headers.TryGetValues("Access-Control-Allow-Origin", out _).Should().BeFalse();
    }

    [Fact]
    public async Task Cors_WithWildcard_AllowsAnyOrigin()
    {
        var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseSetting("CORS_ORIGIN", "*");
        });

        var client = factory.CreateClient();

        var request = new HttpRequestMessage(HttpMethod.Options, "/api/auth/login");
        request.Headers.Add("Origin", "http://any-origin.com");
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await client.SendAsync(request);

        response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values).Should().BeTrue();
        values.Should().Contain("*");
    }
    [Fact]
    public async Task Cors_WithoutConfiguration_DoesNotReturnAccessControlAllowOriginHeader()
    {
        var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            // Empty configuration
        });

        var client = factory.CreateClient();

        var request = new HttpRequestMessage(HttpMethod.Options, "/api/auth/login");
        request.Headers.Add("Origin", "http://any-origin.com");
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await client.SendAsync(request);

        response.Headers.TryGetValues("Access-Control-Allow-Origin", out _).Should().BeFalse();
    }
}
