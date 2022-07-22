import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }
  
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'
    })
    }

  public getOrderHeaders() {
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/cabeceras";
    return this.http.get(url);
  }

  public getOrderById(ped_cab_id: any) {
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/cabeceras/" + ped_cab_id;
    return this.http.get(url);
  }

  public getDetailByHeaderId(det_cab_id: any) {
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/detalles/" + det_cab_id;
    return this.http.get(url);
  }

  public getOrderHeadersByCedula(per_cedula: any) {
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/cabeceras/cedula/" + per_cedula;
    return this.http.get(url);
  }

  public getOrderByCode(ped_codigo: any) {
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/cabeceras/codigo/" + ped_codigo;
    return this.http.get(url);
  }

  public getDetailByHeaderCode(det_cab_codigo: any) {
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/masterdetalle/codigo/" + det_cab_codigo;
    return this.http.get(url);
  }

  public postOrderHeader(cabecera: any){
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/cabeceras"
    return this.http.post(url, JSON.stringify(cabecera) ,this.httpOptions);
  }

  public postOrderDetail(detail: any){
    const url = "https://app-backend-sh-cart.herokuapp.com/pedidos/detalles"
    return this.http.post(url, JSON.stringify(detail) ,this.httpOptions);
  }
  // LOCALH0ST

  // public getOrderHeaders() {
  //   const url = "http://localhost:4000/pedidos/cabeceras";
  //   return this.http.get(url);
  // }

  // public getOrderHeadersByCedula(per_cedula: any) {
  //   const url = "http://localhost:4000/pedidos/cabeceras/cedula/" + per_cedula;
  //   return this.http.get(url);
  // }

  // public getOrderByCode(ped_codigo: any) {
  //   const url = "http://localhost:4000/pedidos/cabeceras/codigo/" + ped_codigo;
  //   return this.http.get(url);
  // }

  // public getDetailByHeaderCode(det_cab_codigo: any) {
  //   const url = "http://localhost:4000/pedidos/masterdetalle/codigo/" + det_cab_codigo;
  //   return this.http.get(url);
  // }
  
}
