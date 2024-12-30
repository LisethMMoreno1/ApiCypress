describe("API Testing with Cypress - PokeAPI", () => {
  const baseUrl = "https://pokeapi.co/api/v2/pokemon";

  it("GET -  Debe tener un formato de respuesta válido para Ditto", () => {
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

  it("POST - No debe permitirse el método POST", () => {
    cy.request({
      method: "POST",
      url: baseUrl,
      failOnStatusCode: false,
      body: {
        name: "new-pokemon",
        id: 9999,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405, 400]);
    });
  });

  it("PUT - No debe permitirse el método PUT", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/ditto`,
      failOnStatusCode: false,
      body: {
        name: "updated-pokemon",
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405, 400]);
    });
  });

  it("DELETE - No debe permitirse el método DELETE", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/ditto`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405, 400]);
    });
  });

  it("GET - Debería devolver 404 por Pokemon inexistente", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/nonexistent-pokemon`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("GET - Debe devolver cabeceras de respuesta correctas", () => {
    cy.request(`${baseUrl}/ditto`).then((response) => {
      expect(response.headers)
        .to.have.property("content-type")
        .that.includes("application/json");
      expect(response.headers)
        .to.have.property("cache-control")
        .that.includes("public");
    });
  });

  it("GET - Debe responder en 500ms", () => {
    cy.request(`${baseUrl}/ditto`).then((response) => {
      expect(response.duration).to.be.lessThan(500);
    });
  });

  it("GET - GET - Debería devolver 404 si el ID Pokemon no es válido o falta", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/-1`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });

    cy.request({
      method: "GET",
      url: `${baseUrl}/invalidString`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
