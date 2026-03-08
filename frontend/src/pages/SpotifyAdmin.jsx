import { useState, useRef } from "react";

const SpotifyAdminUI = () => {
  const [activeTab, setActiveTab] = useState("albums");
  const [albums, setAlbums] = useState([
    { id: 1, title: "Midnight Echoes", artist: "Nova Luna", songs: 12, cover: null, year: 2024 },
    { id: 2, title: "Neon Pulse", artist: "Daft Circuit", songs: 8, cover: null, year: 2024 },
  ]);
  const [songs, setSongs] = useState([
    { id: 1, title: "Dark Matter", album: "Midnight Echoes", duration: "3:42", thumbnail: null },
    { id: 2, title: "Voltage Dreams", album: "Neon Pulse", duration: "4:15", thumbnail: null },
    { id: 3, title: "Stellar Drift", album: "Midnight Echoes", duration: "2:58", thumbnail: null },
  ]);

  const [albumForm, setAlbumForm] = useState({ title: "", artist: "", year: "", thumbnail: null, preview: null });
  const [songForm, setSongForm] = useState({ title: "", albumId: "", audio: null, audioName: "" });
  const [thumbnailForm, setThumbnailForm] = useState({ songId: "", thumbnail: null, preview: null });
  const [deleteSongId, setDeleteSongId] = useState("");
  const [deleteAlbumId, setDeleteAlbumId] = useState("");
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const albumCoverRef = useRef();
  const audioRef = useRef();
  const thumbRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAlbumSubmit = () => {
    if (!albumForm.title || !albumForm.artist) return showToast("Fill all fields", "error");
    setAlbums([...albums, { id: Date.now(), title: albumForm.title, artist: albumForm.artist, songs: 0, cover: albumForm.preview, year: albumForm.year || 2024 }]);
    setAlbumForm({ title: "", artist: "", year: "", thumbnail: null, preview: null });
    showToast("Album created successfully");
  };

  const handleSongSubmit = () => {
    if (!songForm.title || !songForm.albumId) return showToast("Fill all fields", "error");
    const album = albums.find(a => a.id == songForm.albumId);
    setSongs([...songs, { id: Date.now(), title: songForm.title, album: album?.title || "Unknown", duration: "0:00", thumbnail: null }]);
    setSongForm({ title: "", albumId: "", audio: null, audioName: "" });
    showToast("Song uploaded successfully");
  };

  const handleThumbnailSubmit = () => {
    if (!thumbnailForm.songId || !thumbnailForm.thumbnail) return showToast("Select song & image", "error");
    setSongs(songs.map(s => s.id == thumbnailForm.songId ? { ...s, thumbnail: thumbnailForm.preview } : s));
    setThumbnailForm({ songId: "", thumbnail: null, preview: null });
    showToast("Thumbnail added successfully");
  };

  const handleDeleteSong = () => {
    if (!deleteSongId) return showToast("Select a song", "error");
    setSongs(songs.filter(s => s.id != deleteSongId));
    setDeleteSongId("");
    showToast("Song deleted");
  };

  const handleDeleteAlbum = () => {
    if (!deleteAlbumId) return showToast("Select an album", "error");
    setAlbums(albums.filter(a => a.id != deleteAlbumId));
    setDeleteAlbumId("");
    showToast("Album deleted");
  };

  const handleFileDrop = (e, type) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (type === "albumCover") {
      const reader = new FileReader();
      reader.onload = (ev) => setAlbumForm(f => ({ ...f, thumbnail: file, preview: ev.target.result }));
      reader.readAsDataURL(file);
    } else if (type === "audio") {
      setSongForm(f => ({ ...f, audio: file, audioName: file.name }));
    } else if (type === "thumb") {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailForm(f => ({ ...f, thumbnail: file, preview: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "albums", label: "Albums", icon: "💿" },
    { id: "songs", label: "Songs", icon: "🎵" },
    { id: "manage", label: "Manage", icon: "⚙️" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Courier New', monospace", color: "#e8e8e8", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #1DB954; border-radius: 2px; }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes toastIn { from { transform: translateY(20px) translateX(-50%); opacity: 0; } to { transform: translateY(0) translateX(-50%); opacity: 1; } }
        .card { background: #111; border: 1px solid #222; border-radius: 2px; transition: border-color 0.2s; }
        .card:hover { border-color: #1DB954; }
        .input-field { background: #1a1a1a; border: 1px solid #333; border-radius: 2px; color: #e8e8e8; padding: 10px 14px; width: 100%; font-family: 'Courier New', monospace; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #1DB954; }
        .btn-primary { background: #1DB954; color: #000; border: none; padding: 11px 24px; font-family: 'Courier New', monospace; font-weight: 700; font-size: 12px; letter-spacing: 2px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; border-radius: 2px; width: 100%; }
        .btn-primary:hover { background: #1ed760; transform: translateY(-1px); }
        .btn-danger { background: transparent; color: #ff4444; border: 1px solid #ff4444; padding: 11px 24px; font-family: 'Courier New', monospace; font-weight: 700; font-size: 12px; letter-spacing: 2px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; border-radius: 2px; width: 100%; }
        .btn-danger:hover { background: #ff4444; color: #000; }
        .drop-zone { border: 1px dashed #333; border-radius: 2px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .drop-zone:hover, .drop-zone.active { border-color: #1DB954; background: rgba(29,185,84,0.04); }
        .nav-item { padding: 13px 20px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #555; transition: all 0.2s; border-left: 2px solid transparent; }
        .nav-item:hover { color: #e8e8e8; background: rgba(255,255,255,0.03); }
        .nav-item.active { color: #1DB954; border-left-color: #1DB954; background: rgba(29,185,84,0.06); }
        .song-row { display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-bottom: 1px solid #1a1a1a; transition: background 0.15s; }
        .song-row:hover { background: rgba(29,185,84,0.04); }
        .album-card-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid #1a1a1a; transition: background 0.15s; }
        .album-card-row:hover { background: rgba(29,185,84,0.04); }
        .badge { background: rgba(29,185,84,0.15); color: #1DB954; padding: 3px 8px; font-size: 10px; letter-spacing: 1px; border-radius: 1px; white-space: nowrap; }
        select option { background: #1a1a1a; color: #e8e8e8; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0d0d0d", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, background: "#1DB954", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>▶</div>
            <div style={{ fontFamily: "'Bebas Neue', 'Courier New', sans-serif", fontSize: 20, letterSpacing: 3, color: "#fff" }}>SPOTIFY</div>
          </div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#333", textTransform: "uppercase", paddingLeft: 44 }}>Admin Panel</div>
        </div>

        <div style={{ flex: 1, paddingTop: 8 }}>
          {tabs.map(t => (
            <div key={t.id} className={`nav-item ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: 11, color: "#333", letterSpacing: 1 }}>ADMIN</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>root@spotify</div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1DB954", animation: "pulse 2s infinite" }}></div>
            <span style={{ fontSize: 10, color: "#444", letterSpacing: 1 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px 36px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1a1a1a", paddingBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", textTransform: "uppercase", marginBottom: 6 }}>
              {activeTab === "albums" ? "/ ALBUM MANAGEMENT" : activeTab === "songs" ? "/ SONG MANAGEMENT" : "/ CONTENT CONTROL"}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', 'Courier New', sans-serif", fontSize: 30, letterSpacing: 4, color: "#fff" }}>
              {activeTab === "albums" ? "CREATE ALBUMS" : activeTab === "songs" ? "UPLOAD SONGS" : "MANAGE CONTENT"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#444" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#1DB954", fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>{albums.length}</div>
              <div style={{ fontSize: 10, letterSpacing: 1 }}>ALBUMS</div>
            </div>
            <div style={{ width: 1, background: "#222" }}></div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#1DB954", fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>{songs.length}</div>
              <div style={{ fontSize: 10, letterSpacing: 1 }}>SONGS</div>
            </div>
          </div>
        </div>

        {/* ALBUMS TAB */}
        {activeTab === "albums" && (
          <div style={{ animation: "slideIn 0.3s ease", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", marginBottom: 22, textTransform: "uppercase" }}>— New Album</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Album Title</label>
                  <input className="input-field" placeholder="e.g. Dark Matter Vol.1" value={albumForm.title} onChange={e => setAlbumForm(f => ({...f, title: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Artist Name</label>
                  <input className="input-field" placeholder="e.g. Nova Luna" value={albumForm.artist} onChange={e => setAlbumForm(f => ({...f, artist: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Release Year</label>
                  <input className="input-field" placeholder="2024" value={albumForm.year} onChange={e => setAlbumForm(f => ({...f, year: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Album Cover</label>
                  <div
                    className={`drop-zone ${dragOver === "albumCover" ? "active" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragOver("albumCover"); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => handleFileDrop(e, "albumCover")}
                    onClick={() => albumCoverRef.current.click()}
                  >
                    {albumForm.preview ? (
                      <img src={albumForm.preview} style={{ width: 80, height: 80, objectFit: "cover", margin: "0 auto", display: "block", borderRadius: 2 }} alt="preview" />
                    ) : (
                      <>
                        <div style={{ fontSize: 26, marginBottom: 8 }}>🖼️</div>
                        <div style={{ fontSize: 12, color: "#555" }}>Drop image or <span style={{ color: "#1DB954" }}>browse</span></div>
                        <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>PNG, JPG up to 10MB</div>
                      </>
                    )}
                    <input ref={albumCoverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => setAlbumForm(f => ({ ...f, thumbnail: file, preview: ev.target.result }));
                      reader.readAsDataURL(file);
                    }} />
                  </div>
                </div>
                <button className="btn-primary" onClick={handleAlbumSubmit}>+ Create Album</button>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", textTransform: "uppercase" }}>— Library</span>
                <span style={{ fontSize: 10, color: "#444" }}>{albums.length} ALBUMS</span>
              </div>
              <div style={{ maxHeight: 460, overflowY: "auto" }}>
                {albums.map((album, i) => (
                  <div key={album.id} className="album-card-row">
                    <div style={{ width: 44, height: 44, background: "#1a1a1a", borderRadius: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {album.cover ? <img src={album.cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: 20 }}>💿</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#e8e8e8", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{album.artist} · {album.year}</div>
                    </div>
                    <span className="badge">{album.songs} tracks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SONGS TAB */}
        {activeTab === "songs" && (
          <div style={{ animation: "slideIn 0.3s ease", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", marginBottom: 22, textTransform: "uppercase" }}>— Upload Song</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Song Title</label>
                    <input className="input-field" placeholder="e.g. Dark Matter" value={songForm.title} onChange={e => setSongForm(f => ({...f, title: e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Album</label>
                    <select className="input-field" value={songForm.albumId} onChange={e => setSongForm(f => ({...f, albumId: e.target.value}))}>
                      <option value="">Select album...</option>
                      {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Audio File</label>
                    <div
                      className={`drop-zone ${dragOver === "audio" ? "active" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver("audio"); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={e => handleFileDrop(e, "audio")}
                      onClick={() => audioRef.current.click()}
                    >
                      {songForm.audioName ? (
                        <div>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>🎵</div>
                          <div style={{ fontSize: 12, color: "#1DB954", wordBreak: "break-all" }}>{songForm.audioName}</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: 26, marginBottom: 8 }}>🎧</div>
                          <div style={{ fontSize: 12, color: "#555" }}>Drop audio or <span style={{ color: "#1DB954" }}>browse</span></div>
                          <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>MP3, WAV, FLAC</div>
                        </>
                      )}
                      <input ref={audioRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={e => {
                        const file = e.target.files[0];
                        if (file) setSongForm(f => ({ ...f, audio: file, audioName: file.name }));
                      }} />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleSongSubmit}>+ Upload Song</button>
                </div>
              </div>

              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", marginBottom: 22, textTransform: "uppercase" }}>— Add Song Thumbnail</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Select Song</label>
                    <select className="input-field" value={thumbnailForm.songId} onChange={e => setThumbnailForm(f => ({...f, songId: e.target.value}))}>
                      <option value="">Select song...</option>
                      {songs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Thumbnail Image</label>
                    <div
                      className={`drop-zone ${dragOver === "thumb" ? "active" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver("thumb"); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={e => handleFileDrop(e, "thumb")}
                      onClick={() => thumbRef.current.click()}
                    >
                      {thumbnailForm.preview ? (
                        <img src={thumbnailForm.preview} style={{ width: 70, height: 70, objectFit: "cover", margin: "0 auto", display: "block", borderRadius: 2 }} alt="thumb" />
                      ) : (
                        <>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
                          <div style={{ fontSize: 12, color: "#555" }}>Drop or <span style={{ color: "#1DB954" }}>browse</span></div>
                        </>
                      )}
                      <input ref={thumbRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setThumbnailForm(f => ({ ...f, thumbnail: file, preview: ev.target.result }));
                        reader.readAsDataURL(file);
                      }} />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleThumbnailSubmit}>Set Thumbnail</button>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", textTransform: "uppercase" }}>— Track List</span>
                <span style={{ fontSize: 10, color: "#444" }}>{songs.length} SONGS</span>
              </div>
              <div style={{ overflowY: "auto", maxHeight: 580 }}>
                {songs.map((song, i) => (
                  <div key={song.id} className="song-row">
                    <div style={{ fontSize: 10, color: "#333", width: 18, textAlign: "right", flexShrink: 0 }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ width: 38, height: 38, background: "#1a1a1a", borderRadius: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {song.thumbnail ? <img src={song.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: 16 }}>🎵</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#e8e8e8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{song.album}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#555", flexShrink: 0 }}>{song.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === "manage" && (
          <div style={{ animation: "slideIn 0.3s ease", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#ff4444", marginBottom: 6, textTransform: "uppercase" }}>— Delete Song</div>
              <div style={{ fontSize: 11, color: "#444", marginBottom: 22 }}>This action cannot be undone.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Select Song to Delete</label>
                  <select className="input-field" value={deleteSongId} onChange={e => setDeleteSongId(e.target.value)}>
                    <option value="">Choose a song...</option>
                    {songs.map(s => <option key={s.id} value={s.id}>{s.title} — {s.album}</option>)}
                  </select>
                </div>
                {deleteSongId && (
                  <div style={{ background: "rgba(255,68,68,0.06)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 2, padding: "12px 16px" }}>
                    <div style={{ fontSize: 10, color: "#ff6666", letterSpacing: 1 }}>⚠ ABOUT TO DELETE</div>
                    <div style={{ fontSize: 14, color: "#fff", marginTop: 6, fontWeight: 700 }}>{songs.find(s => s.id == deleteSongId)?.title}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{songs.find(s => s.id == deleteSongId)?.album}</div>
                  </div>
                )}
                <button className="btn-danger" onClick={handleDeleteSong}>Delete Song</button>
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#ff4444", marginBottom: 6, textTransform: "uppercase" }}>— Delete Album</div>
              <div style={{ fontSize: 11, color: "#444", marginBottom: 22 }}>This action cannot be undone.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6, display: "block" }}>Select Album to Delete</label>
                  <select className="input-field" value={deleteAlbumId} onChange={e => setDeleteAlbumId(e.target.value)}>
                    <option value="">Choose an album...</option>
                    {albums.map(a => <option key={a.id} value={a.id}>{a.title} — {a.artist}</option>)}
                  </select>
                </div>
                {deleteAlbumId && (
                  <div style={{ background: "rgba(255,68,68,0.06)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 2, padding: "12px 16px" }}>
                    <div style={{ fontSize: 10, color: "#ff6666", letterSpacing: 1 }}>⚠ ABOUT TO DELETE</div>
                    <div style={{ fontSize: 14, color: "#fff", marginTop: 6, fontWeight: 700 }}>{albums.find(a => a.id == deleteAlbumId)?.title}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{albums.find(a => a.id == deleteAlbumId)?.artist}</div>
                  </div>
                )}
                <button className="btn-danger" onClick={handleDeleteAlbum}>Delete Album</button>
              </div>
            </div>

            <div className="card" style={{ padding: 28, gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#1DB954", marginBottom: 22, textTransform: "uppercase" }}>— Content Overview</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {[
                  { label: "Total Albums", value: albums.length, icon: "💿" },
                  { label: "Total Songs", value: songs.length, icon: "🎵" },
                  { label: "With Thumbnails", value: songs.filter(s => s.thumbnail).length, icon: "🖼️" },
                  { label: "Avg Tracks", value: albums.length ? Math.round(songs.length / albums.length) : 0, icon: "📊" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 2, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                    <div style={{ fontFamily: "'Bebas Neue', 'Courier New', sans-serif", fontSize: 34, color: "#1DB954", letterSpacing: 2 }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: "#444", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%",
          background: toast.type === "error" ? "#ff4444" : "#1DB954",
          color: "#000", padding: "10px 28px",
          fontSize: 11, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", borderRadius: 2,
          animation: "toastIn 0.3s ease",
          fontFamily: "'Courier New', monospace",
          whiteSpace: "nowrap", zIndex: 9999,
          transform: "translateX(-50%)",
        }}>
          {toast.type === "error" ? "✕  " : "✓  "}{toast.msg}
        </div>
      )}
    </div>
  );
};

export default SpotifyAdminUI;