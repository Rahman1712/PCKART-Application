import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthService } from './_services/auth.service';
import { Admin } from './_model-dto/admin/admin';
import { FileHandle } from './_model-dto/file-handle.model';
import {map} from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ImageProcessingService } from './_services/image-processing-service.service';
import { AdminsService } from './_services/admins.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, 
    public auth: AuthService,
    private adminService: AdminsService,
    private imageProcessingService: ImageProcessingService,) { }

  title = "PCKART";

  username: string | null;
  admin: Admin;
  adminImageFile: FileHandle | undefined;

  ngOnInit(): void {
    if(this.auth.loggedIn()){
      this.loadAdminDetail();
    }
   }

  toggleMenuBtnClick() {
    $('body').toggleClass('toggle-sidebar');
    if ($('body').hasClass('toggle-sidebar')) {
      $('.toggle-side-btn').removeClass('open-sidebar-box');
      $('.toggle-side-btn').children('i').addClass('bi-arrow-right');
    } else {
      $('.toggle-side-btn').addClass('open-sidebar-box');
      $('.toggle-side-btn').children('i').removeClass('bi-arrow-right');
    }
  }

  toggleSideBtnClick() {
    $('body').toggleClass('toggle-sidebar');
    $('.toggle-side-btn').toggleClass('open-sidebar-box');
    $('.toggle-side-btn').children('i').toggleClass('bi-arrow-right');
  }

  loadAdminDetail(){
    this.username = this.auth.getUsername();
    this.adminService.getAdminByUsername(this.username!)
    .pipe(
      map((admin: Admin) => 
        this.imageProcessingService.createAdminImage(admin)
      )
    )
    .subscribe({
      next: (next: Admin) =>{
        this.admin = next;
        this.adminImageFile = this.admin.adminImage;
        console.log(this.admin)
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  logoutUser() {
    this.auth.clear();
  }
}

/*

var body = $('body');
    var toggleMenuBtn = $('.toggle-menu-btn');
    var toggleSideBtn = $('.toggle-side-btn');
    $(function () {
      
      toggleMenuBtn.on( "click", function() {
       body.toggleClass('toggle-sidebar');
       if(body.hasClass('toggle-sidebar')){
        toggleSideBtn.removeClass('open-sidebar-box');
        toggleSideBtn.children('i').addClass('bi-arrow-right');
      }else{
        toggleSideBtn.addClass('open-sidebar-box');
        toggleSideBtn.children('i').removeClass('bi-arrow-right');
       }

      });

      toggleSideBtn.on( "click", function() {
        body.toggleClass('toggle-sidebar');
        $(this).toggleClass('open-sidebar-box');
        $(this).children('i').toggleClass('bi-arrow-right');
      });

    });

    ================

    toggleMenuBtnClick() {
    $('body').toggleClass('toggle-sidebar');
    if ($('body').hasClass('toggle-sidebar')) {
      $('.toggle-side-btn').removeClass('open-sidebar-box');
      $('.toggle-side-btn').children('i').addClass('bi-arrow-right');
    } else {
      $('.toggle-side-btn').addClass('open-sidebar-box');
      $('.toggle-side-btn').children('i').removeClass('bi-arrow-right');
    }
  }

  toggleSideBtnClick() {
    $('body').toggleClass('toggle-sidebar');
    $('.toggle-side-btn').toggleClass('open-sidebar-box');
    $(this).toggleClass('open-sidebar-box');
    $(this).children('i').toggleClass('bi-arrow-right');
  }


*/