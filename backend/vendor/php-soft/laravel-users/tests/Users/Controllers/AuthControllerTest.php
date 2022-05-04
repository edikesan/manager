<?php

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthControllerTest extends TestCase
{
    public function testLoginFailure()
    {
        // not send credentials
        $res = $this->call('POST', '/auth/login');
        $this->assertEquals(401, $res->getStatusCode());
        $results = json_decode($res->getContent());
        $this->assertEquals('error', $results->status);
        $this->assertEquals('authenticate', $results->type);
        $this->assertEquals('Invalid Credentials.', $results->message);

        // user not found
        $res = $this->call('POST', '/auth/login', [
            'email' => 'nouser@example.com',
            'password' => '123456',
        ]);
        $this->assertEquals(401, $res->getStatusCode());
        $results = json_decode($res->getContent());
        $this->assertEquals('error', $results->status);
        $this->assertEquals('authenticate', $results->type);
        $this->assertEquals('Invalid Credentials.', $results->message);

        // wrong password
        $res = $this->call('POST', '/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'abcdef',
        ]);
        $this->assertEquals(401, $res->getStatusCode());
        $results = json_decode($res->getContent());
        $this->assertEquals('error', $results->status);
        $this->assertEquals('authenticate', $results->type);
        $this->assertEquals('Invalid Credentials.', $results->message);

        // can't create token
        JWTAuth::shouldReceive('attempt')->once()->andThrow(new Tymon\JWTAuth\Exceptions\JWTException('Could not create token.', 500));
        $res = $this->call('POST', '/auth/login');
        $results = json_decode($res->getContent());
        $this->assertEquals(500, $res->getStatusCode());
        $this->assertEquals('Could not create token.', $results->message);
    }

    public function testLoginSuccess()
    {
        $res = $this->call('POST', '/auth/login', [
            'email' => 'admin@example.com',
            'password' => '123456',
        ]);
        $this->assertEquals(200, $res->getStatusCode());
        $results = json_decode($res->getContent());
        $this->assertNotNull($results->entities[0]->token);

        $this->assertEquals('admin@example.com', Auth::user()->email);
    }

    public function testCheckAuthLogout()
    {
        $this->withoutMiddleware();
        $res = $this->call('POST', '/auth/logout');
        $this->assertEquals(401, $res->getStatusCode());
    }

    public function testLogout()
    {
        $credentials = [ 'email' => 'admin@example.com', 'password' => '123456' ];
        $token = JWTAuth::attempt($credentials);

        $this->assertEquals('admin@example.com', Auth::user()->email);

        $res = $this->call('POST', '/auth/logout', [], [], [], ['HTTP_Authorization' => "Bearer {$token}"]);
        $this->assertEquals(204, $res->getStatusCode());
        $this->assertNull(Auth::user());

        // check re-logout
        $res = $this->call('POST', '/auth/logout', [], [], [], ['HTTP_Authorization' => "Bearer {$token}"]);
        $this->assertEquals(401, $res->getStatusCode());
    }
}
