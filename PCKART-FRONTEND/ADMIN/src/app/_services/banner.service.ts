import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../_model-dto/banner/banner';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient) { }

  private apiBannerUrl = environment.apiBannerUrl;
  private apiAdminBannerUrl = environment.apiAdminBannerUrl;

  /* ========================== Banner GET ==================================== */
  public getAllBanners(): Observable<Banner[]>{
    return this.http.get<Banner[]>(`${this.apiBannerUrl}/get/allBanners`);
  }

  public getBannerById(bannerId: string): Observable<Banner>{
    return this.http.get<Banner>(`${this.apiBannerUrl}/get/byId/${bannerId}`);
  }

   /* ============================= Banner =========================================== */ 
  public addBanner(formData: FormData): Observable<string>{
    return this.http.post(`${this.apiAdminBannerUrl}/save`, formData, { responseType: 'text' });
    // return this.http.post<Banner>(`${this.apiBannerUrl}/auth/save`, formData);
  }
  
  public updateBannerById(formData: FormData, bannerId: string): Observable<string>{
    return this.http.put(`${this.apiAdminBannerUrl}/update/${bannerId}`, formData, { responseType: 'text' });
  }

  public updateBannerEnabledById(bannerId: string, enabled: boolean): Observable<string>{
    const params = { enabled: enabled ,};
    return this.http.put(`${this.apiAdminBannerUrl}/update/enabled/${bannerId}`, null, {params: params , responseType: 'text' });
  }

  public deleteBannerById(bannerId: string): Observable<string> {
    return this.http.delete(`${this.apiAdminBannerUrl}/delete/byid/${bannerId}`, { responseType: 'text' });
  }

/* =============================  =========================================== */
}
