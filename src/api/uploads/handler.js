const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverAlbumHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/${filename}`;

    await this._storageService.addAlbumCover(coverUrl, albumId);

    const response = h.response({
      status: 'success',
      message: 'cover berhasil di unggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
