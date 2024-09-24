import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  statistics: any = {
    totalDemandes: 0,
    validées: 0,
    refusées: 0,
    sensibilisés: 0,
    convertis: 0,
    operateurs: 0,
    tauxConversion: 0,
    enattente: 0,
    enattenteinfo: 0,
    sansSensibilisation: 0
  };

  statistiquesParRegion: any;
  statistiquesParRegime: any;
  statistiquesParTypeFormulaire: any;

  regionChartOptions!: EChartsOption;
  regimeChartOptions!: EChartsOption;
  typeFormulaireChartOptions!: EChartsOption;
  kpiChartOptions!: EChartsOption;

  isBrowser: boolean;

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.dashboardService.getStatistics().subscribe(data => {
        this.statistics = data;
      });
      this.loadStatistiques();
      this.loadKPIChart();
    }
  }

  loadStatistiques() {
    if (!this.isBrowser) return;

    this.dashboardService.getDemandesValidéesParRegion().subscribe(data => {
      this.statistiquesParRegion = data;
      this.regionChartOptions = {
        series: [{
          type: 'pie',
          data: data.map((item: { nomville: string, count: number }) => ({
            name: item.nomville,
            value: item.count
          })),
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          labelLine: {
            show: true
          }
        }],
        legend: {
          show: true,
          orient: 'vertical',
          left: 'left'
        },
        title: {
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 16
          }
        }
      };
    });

    this.dashboardService.getDemandesValidéesParRegime().subscribe(data => {
      this.statistiquesParRegime = data;
      this.regimeChartOptions = {
        series: [{
          type: 'pie',
          data: data.map((item: { nomregime: string, count: number }) => ({
            name: item.nomregime,
            value: item.count
          })),
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          labelLine: {
            show: true
          }
        }],
        legend: {
          show: true,
          orient: 'vertical',
          left: 'left'
        },
        title: {
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 16
          }
        }
      };
    });

    this.dashboardService.getDemandesValidéesParTypeFormulaire().subscribe(data => {
      this.statistiquesParTypeFormulaire = data;
      this.typeFormulaireChartOptions = {
        series: [{
          type: 'pie',
          data: data.map((item: { nomtypeformulaire: string, count: number }) => ({
            name: item.nomtypeformulaire,
            value: item.count
          })),
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          labelLine: {
            show: true
          }
        }],
        legend: {
          show: true,
          orient: 'vertical',
          left: 'left'
        },
        title: {
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 16
          }
        }
      };
    });
  }

  loadKPIChart() {
    if (!this.isBrowser) return;

    this.dashboardService.getKPIDeclarationSensibilisation().subscribe(data => {
      console.log(data);

      // Assurez-vous que les données sont bien un tableau et extrayez le premier élément
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];

        // Assurez-vous que les propriétés existent dans l'objet data
        const tauxConversion = firstItem.tauxconversion ? parseFloat(firstItem.tauxconversion) : 0;
        const nombresensibilisationsAvecDemandes = firstItem.nombresensibilisationsavecdemandes || 0;
        const nombreTotalSensibilisations = firstItem.nombretotalsensibilisations || 0;
        console.log(tauxConversion, nombresensibilisationsAvecDemandes, nombreTotalSensibilisations);

        this.kpiChartOptions = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [
              'Taux de Conversion',
              'Nombre d\'Opérateurs déclarés',
              'Nombre Total d\'Opérateurs sensibilisés'
            ],
            top: '8%',  // Déplacement vers le haut pour plus d'espace
            textStyle: {
              fontSize: 12 // Réduction de la taille des légendes pour améliorer la lisibilité
            },
            padding: [0, 20] // Plus de padding autour des légendes
          },
          grid: {
            top: '30%',  // Augmentation de l'espace entre les légendes et le graphique
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          xAxis: {
            type: 'category',
            data: ['KPI Convertion'],
            axisLabel: {
              fontSize: 11 // Réduction de la taille des labels de l'axe X
            }
          },
          yAxis: [
            {
              type: 'value',
              name: 'Pourcentage',
              axisLabel: {
                formatter: '{value}%',
                fontSize: 11 // Réduction de la taille des labels de l'axe Y
              }
            },
            {
              type: 'value',
              name: 'Nombre',
              axisLabel: {
                formatter: '{value}',
                fontSize: 11 // Réduction de la taille des labels de l'axe Y
              }
            }
          ],
          series: [
            {
              name: 'Taux de Conversion',
              type: 'line',
              yAxisIndex: 0,
              data: [tauxConversion],
              label: {
              show: true,
              formatter: '{c}%', // Ajout du symbole % à côté de la valeur
              fontSize: 11 // Réduction de la taille des labels de la série
              }
            },
            {
              name: 'Nombre d\'Opérateurs déclarés',
              type: 'bar',
              yAxisIndex: 1,
              data: [nombresensibilisationsAvecDemandes],
              label: {
                show: true,
                fontSize: 11 // Réduction de la taille des labels de la série
              }
            },
            {
              name: 'Nombre Total d\'Opérateurs sensibilisés',
              type: 'bar',
              yAxisIndex: 1,
              data: [nombreTotalSensibilisations],
              label: {
                show: true,
                fontSize: 11 // Réduction de la taille des labels de la série
              }
            }
          ]
        };

      } else {
        console.error('Les données reçues ne sont pas au format attendu.');
      }
    });
  }



}
