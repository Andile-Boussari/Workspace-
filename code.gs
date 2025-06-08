// Fonction qui renvoie la page HTML du formulaire
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Fonction qui récupère les applications depuis la feuille Application_Type_POC
function getApplications() {
  try {
    const ss = SpreadsheetApp.openById('1NNreSe4LTFIKWuh7o49oeuKc35W8Rd9UCZArWNysuP4');
    const sheet = ss.getSheetByName('Application_Type_POC');
    const data = sheet.getDataRange().getValues();
    const apps = [];

    for (let i = 1; i < data.length; i++) {
      const code = data[i][0]?.toString().trim();
      const nom = data[i][1]?.toString().trim();
      if (code && nom) apps.push({ code, nom });
    }

    return apps;
  } catch (e) {
    Logger.log("Erreur getApplications: " + e);
    return [];
  }
}

// Fonction appelée à la soumission du formulaire
function validerFormulaire(d) {
  try {
    Logger.log("Données reçues : " + JSON.stringify(d));

    const ss = SpreadsheetApp.openById('1NNreSe4LTFIKWuh7o49oeuKc35W8Rd9UCZArWNysuP4');
    let feuille = ss.getSheetByName('Reponses_Formulaires');

    // Si la feuille n'existe pas, on la crée
    if (!feuille) {
      feuille = ss.insertSheet('Reponses_Formulaires');
    }

    // Entêtes à jour avec nouvelles colonnes
    const entetes = [
      "HORODATAGE", "User_Connecte", "CODE_APPLI_CASSINI", "Nom_APPLI",
      "Valid_Techn_Fonc", "ZLS_Validation", "ZLS_VALIDATION2", "ZLS_VALIDATION3",
      "Champs_Temps_Passe", "ZLS_OBS", "PV_TYPE",
      "NbCasPrevus", "NbCasExecutes", "NbCasValides",
      "NbCasValidesAvecReserves", "NbCasNonValides", "controleCohérence"
    ];

    if (feuille.getLastRow() === 0) {
      feuille.appendRow(entetes);
    }

    const ligne = [
      new Date(),
      d.email,
      d.codeCassini,
      d.application,
      d.validation,
      d.niveauValidation,
      d.zls2,
      d.zls3,
      d.tempsPasse,
      d.commentaires,
      d.pvType,
      d.nbCasPrevus || "",
      d.nbCasExecutes || "",
      d.nbCasValides || "",
      d.nbCasValidesAvecReserves || "",
      d.nbCasNonValides || "",
      d.controleCohérence || ""
    ];

    Logger.log("Contenu à insérer : " + JSON.stringify(ligne));

    // Insertion des données
    feuille.appendRow(ligne);

    return "✅ Formulaire envoyé avec succès.";
  } catch (e) {
    Logger.log("Erreur dans validerFormulaire : " + e.toString());
    return "❌ Erreur lors de l'envoi du formulaire.";
  }
}

