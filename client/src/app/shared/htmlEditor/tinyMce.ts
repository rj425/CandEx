import {
  Component,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'tiny-mce',
  template: '<textarea id="{{elementId}}">{{defaultContent}}</textarea>'
})
export class TinyMCEComponent implements AfterViewInit, OnDestroy,OnChanges {
  @Input() elementId: String;
  @Input() width=undefined
  @Input() height=undefined
  @Output() onEditorKeyup = new EventEmitter<any>();
  @Output() finalData:any;
  @Input() disable:boolean=false
  @Input() defaultContent:String
  @Output() sendContent = new EventEmitter<any>();
  @Input() getContent:boolean
  public editor=undefined;
  @Input() editorData:any="";

  ngOnChanges(changes){
    if(this.editor!==undefined){
      try{
        this.editor.setContent(this.defaultContent)
      }
      catch(e){
        console.log(e)
      }
    }
    if (this.getContent===true){
      let content=this.editor.getContent()
      this.sendContent.emit(content)
    }
  }

  ngAfterViewInit() {
    if (this.width==undefined){
      this.width=800
    }
    if (this.height==undefined){
      this.height=210
    }    
    tinymce.init({
      skin_url: '../assets/skins/lightgray',
      selector: '#' + this.elementId,
      branding:false,
      width: this.width,
      height: this.height,
      menubar: false,
      plugins: ['link','paste','table','lists','advlist'],
      toolbar: 'insert | table | undo redo |  styleselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat ',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content)
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

}