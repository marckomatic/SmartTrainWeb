import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {
  displayedColumns: string[] = ['idSesion', 'fecha_hora', 'medida', 'distancia_repeticion', 'valor'];
  titulo: string = "Holi";
  estado: string = "Inactivo";
  idSesion: number;
  idAtleta: number;
  tipoMedicion: number;
  fechaInicio: string;
  today: number = Date.now();
  interval;
  timeInterval;

  //Data para llenar graficas
  dataDistancia = [];
  dataVelocidad = [];
  dataBPM = [];
  dataTmp = [];
  dataRepeticiones = [];

  //Reportes numéricos
  velocidadPromedio = 0;
  velocidadMinima = 0;
  velocidadMaxima = 0;
  repeticion = 0;
  motivoFinalizacion = 'normalmente.';
  infoUsuario: any = {
    nombre: '',
    apellido: ''
  };

  //Datasets para charts
  public bpmLineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];

  public bpmLineChartLabels: Label[] = [];

  public velocidadLineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];

  public velocidadLineChartLabels: Label[] = [];


  public tmpLineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];

  public tmpLineChartLabels: Label[] = [];


  public distanceLineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];

  public distanceLineChartLabels: Label[] = [];

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

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private http: ApiService,
    private route: ActivatedRoute,
    private _router: Router
  ) {
    this.idSesion = Number(this.route.snapshot.paramMap.get('idSesion'));
    this.idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
    this.bpmLineChartData[0].label = "Hearth Beats per Minute";
    this.velocidadLineChartData[0].label = "Velocity (m/s)";
    this.tmpLineChartData[0].label = "Temperature (C)";
    this.distanceLineChartData[0].label = "Distance (m)";


    this.fillData();
    this.fillInfoData();
  }

  ngOnInit(): void {
    this.interval = setInterval(() => { this.fillData() }, 2000);
    this.timeInterval = setInterval(() => { this.updateTime() }, 1000);
  }




  //DATA METHODS

  fillData() {
    this.http.obtenerDatos(this.idAtleta, this.tipoMedicion, this.idSesion).subscribe(
      (result: any) => {
        this.dataBPM = [];
        this.dataDistancia = [];
        this.dataRepeticiones = [];
        this.dataVelocidad = [];
        this.dataTmp = [];

        for (let elemento of result.data.resultado) {
          switch (elemento.medida) {
            case 1:
              this.dataBPM.push(elemento);
              break;
            case 2:
              this.dataTmp.push(elemento);
              break;
            case 3:
              this.dataVelocidad.push(elemento);
              break;
            case 4:
              this.dataDistancia.push(elemento);
              break;
            case 5:
              this.dataRepeticiones.push(elemento);
              break;
          }
        }

        this.fillChartData();

      },
      (error: any) => {
        console.log(error);

      }
    )
  }

  fillChartData() {
    console.log("DATAREPETICIONES")
    console.log(this.dataRepeticiones)
    //Filling BPM chartData
    this.bpmLineChartData[0].data = [];
    this.bpmLineChartLabels = [];
    for (let elemento of this.dataBPM) {
      this.bpmLineChartData[0].data.push(elemento.valor);
      this.bpmLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);
    }

    //Filling TMP chartData
    this.tmpLineChartData[0].data = [];
    this.tmpLineChartLabels = [];
    for (let elemento of this.dataTmp) {
      this.tmpLineChartData[0].data.push(elemento.valor);
      this.tmpLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);
    }
    //Filling Velocity ChartTada
    this.velocidadLineChartData[0].data = [];
    this.velocidadLineChartLabels = [];
    for (let elemento of this.dataVelocidad) {
      this.velocidadLineChartData[0].data.push(elemento.valor);
      this.velocidadLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);
    }

    //Filling Distance chartData
    this.distanceLineChartData[0].data = [];
    this.distanceLineChartLabels = [];
    for (let elemento of this.dataDistancia) {
      this.distanceLineChartData[0].data.push(elemento.valor);
      this.distanceLineChartLabels.push(elemento.fecha_hora.split(' ')[1]);
    }

    //Calculating velocity
    this.velocidadPromedio = 0;
    this.velocidadMinima = this.dataVelocidad[0].valor;

    for (let elemento of this.dataVelocidad) {
      if (elemento.valor < this.velocidadMinima) {
        this.velocidadMinima = elemento.valor;
      }

      if (elemento.valor > this.velocidadMaxima) {
        this.velocidadMaxima = elemento.valor;
      }
      this.velocidadPromedio = this.velocidadPromedio + elemento.valor;
    }
    this.velocidadPromedio = this.velocidadPromedio / this.dataVelocidad.length;
  }

  fillInfoData() {
    this.http.obtenerInfoAtleta(this.idAtleta).subscribe(
      (result: any) => {
        this.infoUsuario = result.resultado;
      },
      (error: any) => {
        console.log(error);
      }
    );

    this.http.obtenerInfoSesion(this.idSesion).subscribe(
      (result: any) => {
        this.fechaInicio = result.resultado.fecha_hora;
      }
    )

  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  updateTime() {
    this.today = Date.now();
  }

  seeReports() {
    this._router.navigate(['../../../reports', this.idSesion, this.idAtleta], { relativeTo: this.route });
  }
}
