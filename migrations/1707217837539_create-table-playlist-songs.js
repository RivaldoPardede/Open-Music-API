exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_songs',
    'unique_playlist_id_song_id',
    'UNIQUE(playlist_id, song_id)',
  );

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_song_id.song_id',
    'FOREIGN KEY(song_id) REFERENCES songs(song_id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_playlist_id.playlist_id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = pgm => {
  pgm.dropTable('playlist_songs');
};
