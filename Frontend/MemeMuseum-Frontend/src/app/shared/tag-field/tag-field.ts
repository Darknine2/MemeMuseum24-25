import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-field',
  imports: [FormsModule],
  templateUrl: './tag-field.html',
  styleUrl: './tag-field.scss',
})
export class TagField {

  @Input() tagsToSearch: string[] = [];
  tagInput: string = '';

  @Output() tagsToSearchChange = new EventEmitter<string[]>();


  addTag() {
    const tag = this.tagInput.trim().toLowerCase();
    if (!tag || this.tagsToSearch.includes(tag) || this.tagsToSearch.length >= 5) return;
    this.tagsToSearch.push(tag);
    this.tagInput = '';
    this.tagsToSearchChange.emit(this.tagsToSearch);
  }

  onTagKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  removeTag(tag: string) {
    this.tagsToSearch = this.tagsToSearch.filter(t => t !== tag);
    this.tagsToSearchChange.emit(this.tagsToSearch);
  }


}
