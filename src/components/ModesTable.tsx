export const ModesTable = () => (
  <section className="chart-section">
    <h2>Modes d'ajout — couverture actuelle</h2>

    <table>
      <thead>
        <tr>
          <th>Type d'objet</th>
          <th>Manuel (UI)</th>
          <th>Par fichier</th>
          <th>Automatisé (API/intégration)</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Membres</td>
          <td>oui</td>
          <td>CSV (1 007 orgas)</td>
          <td>SCIM (26 orgas) + API</td>
        </tr>

        <tr>
          <td>Publications</td>
          <td>oui</td>
          <td>non</td>
          <td>API Cetautomatix (52 orgas)</td>
        </tr>

        <tr>
          <td>Messages</td>
          <td>oui</td>
          <td>non</td>
          <td>non</td>
        </tr>

        <tr>
          <td>Documents</td>
          <td>oui</td>
          <td>non</td>
          <td>non</td>
        </tr>

        <tr>
          <td>Events</td>
          <td>oui</td>
          <td>non</td>
          <td>non</td>
        </tr>

        <tr>
          <td>Jobs</td>
          <td>oui</td>
          <td>non</td>
          <td>non</td>
        </tr>

        <tr>
          <td>Feeds</td>
          <td>oui</td>
          <td>non</td>
          <td>RSS (51K articles/mois)</td>
        </tr>
      </tbody>
    </table>
  </section>
)
