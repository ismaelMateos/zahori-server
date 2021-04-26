import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../../../model/tag';
import { DataService } from '../../../../../services/data.service'
import { BannerOptions } from '../../../../../utils/banner/banner'
import Swal from 'sweetalert2/dist/sweetalert2.js';


const SUCCESS : string = "Operación realizada con éxito";
const ERROR: string = "Algo ha ido mal";
const SUCCESS_COLOR : string = "alert alert-success";
const ERROR_COLOR : string = "alert alert-danger";

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.css']
})
export class AdminTagsComponent implements OnInit {

  tags : Tag[] = [];
  myTags : Tag[] = [];
  banner: BannerOptions;
  showrow : boolean = false;

  ngOnInit() {
    this.refresh();
    this.banner = new BannerOptions();
  }  
  constructor(public dataService: DataService) {
  }

  refresh(){
    this.dataService.getTags(String(this.dataService.processSelected.processId)).subscribe(
      (res : any) => {
        console.log(JSON.stringify(res))
        this.tags = res;
      });
  }

  deleteTag(tag: Tag){
    tag.active = false;
    let tagArray: Tag[] = [tag];
    this.sendPostPetition(tagArray, new BannerOptions(SUCCESS, "El entorno " + tag.name + " ha sido eliminado", SUCCESS_COLOR , true ));

    }

  updateTag(tag : Tag){
    if (tag.name.length == 0 ){
      this.banner = new BannerOptions(ERROR, "Todos los campos son obligatorios", ERROR_COLOR , true )
    }
    else if (this.tags.filter(candidate => candidate.name === tag.name).length > 1){
      this.banner = new BannerOptions(ERROR, "El tag \"" + tag.name + "\" ya existe. elija un nombre distinto", ERROR_COLOR , true )
    }
    else if (this.tags.filter(candidate => candidate.color === tag.color).length > 1){
      this.banner = new BannerOptions(ERROR, "El color para el tag \"" + tag.name + "\" ya está asignado a otro tag. Por favor, elija un color distinto", ERROR_COLOR , true )
    }
    else{
      let tagArray: Tag[] = [tag];
      this.sendPostPetition(tagArray, new BannerOptions(SUCCESS, "Se ha modificado la etiqueta " + tag.name, SUCCESS_COLOR , true ));
    }
    
  }
  
  createTag(tag : Tag){    
    if (tag.name.length == 0){
      this.banner = new BannerOptions(ERROR, "Todos los campos son obligatorios", ERROR_COLOR , true );
    } 
    else if (this.tags.filter(candidate => candidate.name === tag.name).length > 0){
      this.banner = new BannerOptions(ERROR, "El tag \"" + tag.name + "\" ya existe. elija un nombre distinto", ERROR_COLOR , true )
    }
    else if (this.tags.filter(candidate => candidate.color === tag.color).length > 0){
      this.banner = new BannerOptions(ERROR, "El color para el tag \"" + tag.name + "\" ya está asignado a otro tag. Por favor, elija un color distinto", ERROR_COLOR , true )
    }
    else{
      let tagArray: Tag[] = [tag];
      this.sendPostPetition(tagArray, new BannerOptions(SUCCESS, "Se ha creado la etiqueta " + tag.name, SUCCESS_COLOR , true ));
      this.deleteFromArray(tag);
    }
    
  }

  duplicateElement(tag : Tag){
       Swal.fire({
          title: 'La etiqueta ' + tag.name + ' ya existe',
          text: 'Por favor, elija un nombre distinto',
          icon: 'warning',
          confirmButtonText: 'Ok',
          backdrop: `
              rgba(64, 69, 58,0.4)
              left top
              no-repeat`
      })
  }

  isUnique(tag: Tag) : Boolean{
    var filtered : Tag[] = this.tags.filter(candidate => candidate.name === tag.name);
    if (filtered.length === 0){
      return true;
    }
    return false;
  }

  deleteFromArray(tag : Tag){
    let index : number = this.myTags.indexOf(tag);
    if (index !== -1){
      this.myTags.splice(index, 1);
    }
  }
 
  sendPostPetition(tag : Tag[], banner : BannerOptions){
    this.dataService.setTags(tag, String(this.dataService.processSelected.processId)).subscribe(
      (res : any) => {
        this.refresh();
        this.banner = banner
        this.showrow = false;
      });
      error => {
        console.log("Error en la petición:" + error);
        this.banner = new BannerOptions(ERROR, error, ERROR_COLOR , true )
      }  }

  closeBanner(){
    this.banner = new BannerOptions;
  }
  
  newTag(){
    this.myTags.push(new Tag);
  }
}