describe("API Testing with Cypress - PokeAPI", () => {
  const baseUrl = "https://pokeapi.co/api/v2/pokemon";

  // Test para el método GET
  it("GET - Should have a valid response format for Ditto", () => {
    cy.request(`${baseUrl}/ditto`).then((response) => {
      expect(response.body).to.include.keys(
        "abilities",
        "base_experience",
        "height",
        "id",
        "name",
        "sprites",
        "stats",
        "types"
      );
      expect(response.body.id).to.be.a("number");
      expect(response.body.name).to.be.a("string");
      expect(response.body.abilities).to.be.an("array");
    });
  });

  // Test para el método POST
  it("POST - Should not allow POST method", () => {
    cy.request({
      method: "POST",
      url: baseUrl,
      failOnStatusCode: false, // No falla el test si el status code no es 2xx
      body: {
        name: "new-pokemon",
        id: 9999,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405, 400]); // Ajusta para incluir 404
    });
  });

  // Test para el método PUT
  it("PUT - Should not allow PUT method", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/ditto`,
      failOnStatusCode: false,
      body: {
        name: "updated-pokemon",
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405, 400]); // Ajusta para incluir 404
    });
  });

  // Test para el método DELETE
  it("DELETE - Should not allow DELETE method", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/ditto`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405, 400]); // Ajusta para incluir 404
    });
  });

  // Validación de error con un recurso inexistente
  it("GET - Should return 404 for non-existent Pokemon", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/nonexistent-pokemon`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // Verificación de encabezados de respuesta
  it("GET - Should return correct response headers", () => {
    cy.request(`${baseUrl}/ditto`).then((response) => {
      expect(response.headers)
        .to.have.property("content-type")
        .that.includes("application/json");
      expect(response.headers)
        .to.have.property("cache-control")
        .that.includes("public");
    });
  });

  // Verificar tiempo de respuesta
  it("GET - Should respond within 500ms", () => {
    cy.request(`${baseUrl}/ditto`).then((response) => {
      expect(response.duration).to.be.lessThan(500);
    });
  });

  it("GET - Should return 404 for invalid or missing Pokemon ID", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/-1`, // Caso límite
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });

    cy.request({
      method: "GET",
      url: `${baseUrl}/invalidString`, // String no válido
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
