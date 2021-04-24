import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-espirometter',
  templateUrl: './espirometter.component.html',
  styleUrls: ['./espirometter.component.css']
})
export class EspirometterComponent implements OnInit {
  sessions: any[] = [];
  athleteName: string;
  today: number = Date.now();
  fechaInicio: number = 0;
  nombreTipo: string;
  timeInterval;
  imageUrl: string;
  infoUsuario: any = {
    nombre: '',
    apellido: '',
    peso: 0,
    estatura: 0,
    sexo: ''
  }

  dataSesion: any[] = [];
  elapsedTime: number = 0;
  //Datasets para charts
  public oxygenLineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];

  public oxygenLineChartLabels: Label[] = [];

  //Extra data for charts  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'purple',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: 'blue',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  //GAUGE CHART OPTIONS

  public canvasWidth = 300
  public needleValue = 0
  public centralLabel = '0.5'
  public name = 'Volumen de Aire Entrante'
  public bottomLabel = 'Litros'
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 500,
    arcColors: ['lightgreen', 'yellow', 'orange'],
    arcDelimiters: [50, 80],
    rangeLabel: ['0', '1'],
    needleStartValue: 0,
  }

  constructor(private httpService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
    this.fillData();
    this.oxygenLineChartData[0].label = "Volumen de Oxigeno (Litros)";
    let idSesion = Number(this.route.snapshot.paramMap.get('idSesion'));

    this.fillChartData(idSesion);
    setInterval(() => { this.fillChartData(idSesion) }, 1000);
  }

  ngOnInit(): void {
  }


  fillData() {
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));

    this.httpService.obtenerInfoAtleta(idAtleta).subscribe(
      (result: any) => {
        this.infoUsuario = result.resultado;
      },
      (error: any) => {
        console.log(error);
      }
    )
    let idSesion = Number(this.route.snapshot.paramMap.get("idSesion"));
    this.httpService.obtenerInfoSesion(idSesion).subscribe(
      (result: any) => {
        console.log('Fecha de sesion')
        console.log(result);
        this.fechaInicio = Date.parse(result.resultado.fecha_hora);
        let timeStart = this.fechaInicio;
        let timeEnd = Date.now();
        this.elapsedTime = (timeEnd - timeStart);
        if (this.elapsedTime > 300000) {
          this.elapsedTime = 300000;
        }

        this.elapsedTime = (timeEnd - timeStart);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  fillChartData(idSesion) {

    this.today = Date.now();
    let timeStart = this.fechaInicio;
    let timeEnd = Date.now();
    this.elapsedTime = (timeEnd - timeStart);
    if (this.elapsedTime > 300000) {
      this.elapsedTime = 300000;
    }
    this.httpService.obtenerDatos(0, 0, idSesion).subscribe(
      (result: any) => {
        console.log(result);
        this.dataSesion = [];
        this.oxygenLineChartData[0].data = [];
        this.oxygenLineChartLabels = []
        for (let elemento of result.data.resultado) {
          this.dataSesion.push(elemento);

        }
        console.log(this.dataSesion);
        this.needleValue = this.dataSesion[this.dataSesion.length - 1].valor * 100;          

        if(this.elapsedTime > 30000){
          this.name = "Volumen de aire inhalado (Promedio)"
          let totalInhalado = 0;
          let vecesInhaladas = 0;
          for (let element of this.dataSesion) {
            if (element.medida == 2) {
              totalInhalado += element.valor;
              vecesInhaladas++;
            }
          }
          totalInhalado = totalInhalado / vecesInhaladas;
          this.needleValue = (totalInhalado * 100) / 1;          
        }



        for (let elemento of this.dataSesion) {
          if (elemento.medida == 1) {
            this.oxygenLineChartData[0].data.push(elemento.valor * -1);
            this.oxygenLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);

          } else if (elemento.medida == 2) {
            this.oxygenLineChartData[0].data.push(elemento.valor);
            this.oxygenLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);

          }
        }


      },
      (error) => {
        console.log(error);
      }
    )
  }


  //Sessión actions
  openWeightDialog() {
    const dialogRef = this.dialog.open(WeightDialog, {
      width: '250px',
      data: { weight: this.infoUsuario.peso }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.infoUsuario.peso = result;
      let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
      this.httpService.cambiarPeso(this.infoUsuario.peso, idAtleta).subscribe(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  seeReport() {
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
    let idSesion = Number(this.route.snapshot.paramMap.get("idSesion"));
    this.router.navigate(['../../../spiroReport', idSesion, idAtleta], { relativeTo: this.route });

  }
}

@Component({
  selector: 'weight-dialog',
  templateUrl: 'weight-dialog.html',
})
export class WeightDialog {

  constructor(
    public dialogRef: MatDialogRef<WeightDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}