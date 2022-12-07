pipeline {
    agent any
	environment {
		nom = 'toto'
		couleur = 'rouge'
	}
    stages {
        stage('Lister les variables') {
            steps {
                echo 'Lister..'
            }
        }
        stage('Utilisation des variables') {
            steps {
                echo "Nom: ${env.nom}"
				echo "Couleur: ${env.couleur}"
            }
			
        }
    }
}
