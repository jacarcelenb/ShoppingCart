import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  public getProduct(){
    return this.http.get<any>("https://app-backend-sh-cart.herokuapp.com/productos")
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  public getProducts() {
    const url = "https://app-backend-sh-cart.herokuapp.com/productos";
    return this.http.get(url);
  }

  

  public getProductByName(pro_name: any) {
    const url = "https://app-backend-sh-cart.herokuapp.com/productos/" + pro_name;
    return this.http.get(url);
  }

  public deleteProduct(pro_id:any,body:any){
    const url= `https://app-backend-sh-cart.herokuapp.com/productos/delete/`+pro_id
    return this.http.put(url,body)
  }
  
  public postCreateProduct(body:any){
    const url= `https://app-backend-sh-cart.herokuapp.com/productos`
    return this.http.post(url,body,this.httpOptions)
  }
  
  public putUpdateProduct(id: any,body:any){
    const url= `https://app-backend-sh-cart.herokuapp.com/productos/id/`+id
    return this.http.put(url,body)
  }

  public putUpdateStock(id: any,body:any){
    const url=`https://app-backend-sh-cart.herokuapp.com/productos/stock/`+id
    return this.http.put(url,body)
  }

}