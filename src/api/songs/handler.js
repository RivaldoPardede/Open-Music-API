/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title = 'untitled', year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this._service.addSong(
      {
        title, year, genre, performer, duration, albumId,
      },
    );

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;

    if (title && performer) {
      const songs = await this._service.getSongByTitleOrPerformer(title, performer);
      const result = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: 'success',
        message: 'Seluruh Lagu berdasarkan title dan performer berhasil didapatkan',
        data: {
          songs: result,
        },
      };
    }
    if (title) {
      const songs = await this._service.getSongByTitle(title);
      const result = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: 'success',
        message: 'Seluruh Lagu berdasarkan title berhasil didapatkan',
        data: {
          songs: result,
        },
      };
    }
    if (performer) {
      const songs = await this._service.getSongByPerformer(performer);
      const result = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: 'success',
        message: 'Seluruh Lagu berdasarkan performer berhasil didapatkan',
        data: {
          songs: result,
        },
      };
    }

    const songs = await this._service.getSongs();
    return {
      status: 'success',
      message: 'Seluruh Lagu berhasil didapatkan',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      message: 'Lagu berdasarkan id berhasil didapatkan',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diperbaharui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
