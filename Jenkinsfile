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
		environment {
			loisir = 'football'
		}
        	steps {    
                	echo "Nom: ${env.nom}"
			echo "Couleur: ${env.couleur}"
			script {
				env.couleur = 'bleu'
			}
			echo "Couleur: $ {env.couleur}"
        }
    }
}
}
