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

    const album = await this._albumsService.getAlbumById(albumId);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._storageService.addAlbumCover(filename, albumId);

    if (album.cover) {
      await this._storageService.deleteFile(album.cover);
    }

    const response = h.response({
      status: 'success',
      message: 'cover berhasil di unggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
