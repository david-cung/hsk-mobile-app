def test_register_and_login(client):
    email = "testuser@example.com"
    password = "secret123"
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "display_name": "Test"},
    )
    assert reg.status_code == 201
    assert "access_token" in reg.json()

    login = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == email
