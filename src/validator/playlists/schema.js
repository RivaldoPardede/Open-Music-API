const Joi = require('joi');

const PostPlaylistPayloadShema = Joi.object({
  name: Joi.string().required(),
});

const PostSongToPlaylistPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistPayloadShema,
  PostSongToPlaylistPayloadSchema,
};
