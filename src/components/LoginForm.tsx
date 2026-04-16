export const LoginForm = ({
  token,
  onTokenChange,
  onConnect,
  loading,
  error,
  user,
}: {
  token: string
  onTokenChange: (token: string) => void
  onConnect: () => void
  loading: boolean
  error: string | null
  user: string | null
}) => {

  if (loading && user) {

    return (
      <div className="login">
        <h1>Chargement des données Metabase...</h1>

        <p>
          Connecté en tant que
          {user}
        </p>
      </div>
    )
  }

  return (
    <div className="login">
      <h1>Dashboard OKR - Steeple</h1>
      <p>Colle ton token Metabase (X-Metabase-Session)</p>

      <input
        type="text"
        value={token}
        placeholder="a530ac37-6278-..."
        onChange={e => onTokenChange(e.target.value)}
      />

      <button type="button" disabled={loading} onClick={onConnect}>
        {loading ? 'Connexion...' : 'Connexion'}
      </button>

      {error ? (
        <p className="error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
