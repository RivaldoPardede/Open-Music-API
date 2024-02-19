const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const result = await this._service.getAlbumById(id);
    if (!result.rows[0].cover) {
      result.coverUrl = null;
    } else {
      result.coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${result.rows[0].cover}`;
    }

    console.log(result.coverUrl);
    console.log(result.rows[0].cover);
    if (!result.rows[0].song_id) {
      const album = {
        id: result.rows[0].album_id,
        name: result.rows[0].name,
        year: result.rows[0].year,
        songs: [],
      };
      return {
        status: 'success',
        message: 'Album berdasarkan id berhasil didapatkan',
        data: {
          album,
        },
      };
    }
    const album = {
      id: result.rows[0].album_id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      songs: result.rows.map((songs) => ({
        id: songs.song_id,
        title: songs.title,
        performer: songs.performer,
      })),
    };
    return {
      status: 'success',
      message: 'Detail album berdasarkan id berhasil didapatkan',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;
    await this._service.editAlbumById(id, { name, year });
    return {
      status: 'success',
      message: 'Album berhasil diperbaharui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
