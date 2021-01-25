/* eslint-disable no-console */
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Artist, Album } = require("../src/models");

describe("/albums", () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: "Tame Impala",
        genre: "Rock",
      });
    } catch (err) {
      console.log(err);
    }
  });

  /////////////////////////////
  // CREATES THE ALBUMS (POST)
  /////////////////////////////

  describe("POST /artists/:artistId/albums", () => {
    it("creates a new album for a given artist", (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: "InnerSpeaker",
          year: 2010,
        })
        .then((response) => {
          expect(response.status).to.equal(201);

          Album.findByPk(response.body.id, { raw: true })
            .then((album) => {
              expect(album.name).to.equal("InnerSpeaker");
              expect(album.year).to.equal(2010);
              expect(album.artistId).to.equal(artist.id);
              done();
            })
            .catch((error) => done(error));
        })
        .catch((error) => done(error));
    });

    it("returns a 404 and does not create an album if the artist does not exist", (done) => {
      request(app)
        .post("/artists/1234/albums")
        .send({
          name: "InnerSpeaker",
          year: 2010,
        })
        .then((response) => {
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal("The artist could not be found.");

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });

  //////////////////////////
  // READS THE ALBUMS (GET)
  /////////////////////////

  describe("populate albums in the database", () => {
    let albums;
    let artists;

    beforeEach((done) => {
      Promise.all(
        Promise.all([
          Artist.create({ name: "DjRUM", genre: "Electronic" }),
          Artist.create({ name: "Daniel Avery", genre: "Drone" }),
          Artist.create({ name: "Studnitzky", genre: "Jazz" }),
        ]).then((artistDocuments) => {
          artists = artistDocuments;
        done();
      })
  );
});

beforeEach((done) => {
  Promise.all(
  Promise.all([
    Album.create({ name: "Portrait with Firewood", year: 2018 }).then(album => album.setArtist(artists[0])),
    Album.create({ name: "Seven Lies", year: 2013 }).then(album => album.setArtist(artists[0])),
    Album.create({ name: "Drone Logic", year: 2013 }).then(album => album.setArtist(artists[1])),
    Album.create({ name: "New Energy Collected Remixes", year: 2015 }).then(album => album.setArtist(artists[1])),
    Album.create({ name: "KY Do Mar", year: 2012 }).then(album => album.setArtist(artists[2])),
       ]).then((documents) => {
      albums = documents;
      done();
  })
);
});

    describe('GET /albums', () => {
        it('Lists all albums', (done) => {
            request(app)
                .get('/albums')
                .then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body.length).to.equal(5);
                    done();
                })
                .catch((error) => done(error));
        });
    })


  //////////////////////////////
  // UPDATES THE ALBUMS (PATCH)
  /////////////////////////////

describe('PATCH /albums/:albumId', () => {
  it ('Updates an album if you change the album information', (done) => {
    const album = albums[0]
    request(app)
      .patch(`/albums/${album.id}`)
      .send({ name: "Portrait with Firewood", year: 2020 })
      .then((response) => {
        expect(response.status).to.equal(200);
        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
        expect(updatedAlbum.year).to.equal(2020);
        done();
      })
      .catch(error => done(error));
  })
})

  // KEEP AT BOTTOM
    })
  })
});