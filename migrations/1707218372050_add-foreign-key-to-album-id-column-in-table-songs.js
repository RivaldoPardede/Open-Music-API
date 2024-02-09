exports.up = pgm => {
  pgm.addConstraint(
    'songs',
    'fk_song_album',
    'FOREIGN KEY("album_id") REFERENCES albums(album_id) ON DELETE CASCADE',
  );
};

exports.down = pgm => {
  pgm.dropConstraint('songs', 'fk_song_album');
};
