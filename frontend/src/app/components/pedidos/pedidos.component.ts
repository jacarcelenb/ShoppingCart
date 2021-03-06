import { Component, OnInit } from '@angular/core';
import { ModelPedido } from 'src/app/model/model.pedido';
import { ModelPedidoDetalle } from 'src/app/model/model.pedido-detalle';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PedidosService } from 'src/app/service/pedidos.service';
import { formatDate } from "@angular/common";


import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: ModelPedido[] = [];
  cliente: string = '1004600183';
  detallesPedido: ModelPedidoDetalle[] = [{
    per_cedula: "",
    per_nombres: "",
    per_telefono: "",
    per_correo: "",
    pro_nombre: "",
    pro_descripcion: "",
    codigo_prod: "",
    ped_cab_id: -1,
    per_id: -1,
    ped_cab_codigo: "",
    ped_cab_fecha: "",
    ped_cab_subtotal: -1,
    ped_cab_iva: -1,
    ped_cab_total: -1,
    ped_det_id: -1,
    ped_det_cant: -1,
    ped_det_unitario: -1,
    ped_det_total: -1
  }
  ];

  public form1!: FormGroup;

  public informacionPedido = {
    ped_cab_id: -1,
    per_id: -1,
    ped_cab_codigo: "",
    ped_cab_fecha: "",
    ped_cab_subtotal: "",
    ped_cab_iva: "",
    ped_cab_total: ""
  }

  constructor(private pedidoService: PedidosService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.leerPedidos();
    this.form1 = this.formBuilder.group({
      txtpro_codigo: ['']
    })
  }

  public leerPedidos() {
    this.pedidoService.getOrderHeaders().subscribe(
      (pedido: any) => {
        this.pedidos = pedido
        console.log(this.pedidos)
      },
      (error) => console.warn(error)
    )
  }

  public cambiarformatoFecha(date: any) {
    var fecha = String(date)
    return fecha.replace("T00:00:00.000Z", "")
  }
  public leerPedidoById() {
    this.pedidoService.getOrderById(this.form1.value.txtCodigoPedido).subscribe(
      (pedido: any) => {
        this.pedidos = pedido
        if (this.pedidos.length == 0) {
          this.leerPedidos();
        }
        console.log(this.pedidos)
      },
      (error) => console.warn(error)
    )
  }

  public leerDetalleByPedidoId(ped_cab_id: any) {
    this.pedidoService.getDetailByHeaderId(ped_cab_id).subscribe(
      (detalle: any) => {
        this.detallesPedido = detalle
        console.log(this.detallesPedido);
      },
      (error) => console.warn(error)
    )
  }

  public leerPedidosByCedula() {
    this.pedidoService.getOrderHeadersByCedula(this.cliente).subscribe(
      (pedido: any) => {
        this.pedidos = pedido
        console.log(this.pedidos)
      },
      (error) => console.warn(error)
    )
  }


  public leerPedidoByCodigo() {
    this.pedidoService.getOrderByCode(this.form1.value.txtCodigoPedido).subscribe(
      (pedido: any) => {
        this.pedidos = pedido
        if (this.pedidos.length == 0) {
          this.leerPedidosByCedula();
        }
        console.log(this.pedidos)
      },
      (error) => console.warn(error)
    )
  }

  public leerDetalleByCodigoPedido(ped_cab_codigo: any) {
    this.pedidoService.getDetailByHeaderCode(ped_cab_codigo).subscribe(
      (detalle: any) => {
        this.detallesPedido = detalle
        console.log(this.detallesPedido);
      },
      (error) => console.warn(error)
    )
  }

  public redonderNumero(numero: any) {
    var numeroRedondeado = numero.toFixed(2);
    return numeroRedondeado;
  }

  header: any = [['Id', 'C??digo', 'Nombre Producto', 'Precio', 'Cantidad', 'Total']]

  tableData: any = []

  public llenarTableData() {
    var dataTable: any = []
    let cont = 0;
    this.detallesPedido.forEach(detalle => {
      cont++;
      detalle.ped_cab_id = cont;
      dataTable = [
        detalle.ped_cab_id,
        detalle.codigo_prod,
        detalle.pro_nombre,
        detalle.ped_det_unitario,
        detalle.ped_det_cant,
        detalle.ped_det_total
      ]
      this.tableData.push(dataTable);
    });
  }

  public generarComprobantePedido() {
    this.llenarTableData();

    var logo = new Image();
    logo.src = 'https://cdn0.iconfinder.com/data/icons/shopping-and-commerce-outline/512/Shopping_and_Commerce_-_Outline_21-512.png';
    // const doc = new jsPDF('p', 'pt', 'a4');
    const doc = new jsPDF();

    // -------------------------------------------------------------------------------------------
    //                  HEADER ORDER PDF
    // -------------------------------------------------------------------------------------------
    doc.setFont('courier', 'bold');
    doc.setFontSize(26);
    doc.text("Shopping Cart", 105, 15, { align: 'center' });
    doc.addImage(logo, 'PNG', 90, 20, 25, 20);
    doc.setFontSize(14);
    doc.setFont('courier', 'bold')
    doc.text("Datos del Cliente", 55, 45, { align: 'center' });
    doc.text("Datos del Pedido", 155, 45, { align: 'center' });

    doc.text("____________________________________________________________", 105, 74, { align: 'center' });
    doc.text("DETALLES DEL PEDIDO", 105, 81, { align: 'center' });
    doc.text("____________________________________________________________", 105, 82, { align: 'center' });

    doc.setFontSize(12);
    doc.text("C??dula:", 15, 53, { align: 'left' });
    doc.text("Nombres:", 15, 59, { align: 'left' });
    doc.text("Correo:", 15, 65, { align: 'left' });
    doc.text("Tel??fono:", 15, 71, { align: 'left' });

    doc.text("C??digo Pedido: ", 120, 53, { align: 'left' });
    doc.text("Fecha de Pedido:", 120, 59, { align: 'left' });

    doc.setFont('courier', 'normal');
    doc.text(this.detallesPedido[0].per_cedula, 40, 53);
    doc.text(this.detallesPedido[0].per_nombres, 40, 59);
    doc.text(this.detallesPedido[0].per_correo, 40, 65);
    doc.text(this.detallesPedido[0].per_telefono, 40, 71);

    doc.text(this.detallesPedido[0].ped_cab_codigo, 165, 53);
    doc.text(this.cambiarformatoFecha(this.detallesPedido[0].ped_cab_fecha), 165, 59);

    // -------------------------------------------------------------------------------------------
    //                  DETAILS ORDER PDF
    // -------------------------------------------------------------------------------------------

    (doc as any).autoTable({
      head: this.header,
      body: this.tableData,
      font: 'courier',
      theme: 'plain',
      margin: {
        top: 85,
        bottom: 65
      }
      // didDrawCell: data => {
      //   console.log(data.column.index)
      // }
    })

    // -------------------------------------------------------------------------------------------
    //                  FOOTER ORDER PDF
    // -------------------------------------------------------------------------------------------

    doc.setFont('courier', 'bold')
    doc.text("Subtotal:  |", 66.5, 243);
    doc.text("Iva:       |", 66.5, 251.5);
    doc.text("Total:     |", 66.5, 260.5);

    doc.text("--------------+--------------", 95.7, 239, { align: 'center' });
    doc.text("--------------+--------------", 95.7, 247.5, { align: 'center' });
    doc.text("--------------+--------------", 95.7, 256, { align: 'center' });
    doc.text("--------------+--------------", 95.7, 265, { align: 'center' });


    doc.setFont('courier', 'normal')
    doc.text("" + this.detallesPedido[0].ped_cab_subtotal, 105, 243);
    doc.text("" + this.redonderNumero(this.detallesPedido[0].ped_cab_iva * this.detallesPedido[0].ped_cab_subtotal), 105, 251.5);
    doc.text("" + this.detallesPedido[0].ped_cab_total, 105, 260.5);

    doc.text("____________________________________________________________", 105, 275, { align: 'center' });
    doc.setFontSize(10);
    let fecha = formatDate(new Date(), 'dd-MM-yyyy', 'en-US')
    doc.text("Este documento cuenta con una validez de 30 d??as h??biles.", 105, 280, { align: 'center' });
    doc.text("Fecha Generaci??n Documento: " + fecha, 105, 285, { align: 'center' });

    doc.output('dataurlnewwindow');
  }


}
