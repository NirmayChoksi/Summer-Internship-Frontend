import { Component, computed, input, OnDestroy, output, signal } from '@angular/core';

import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { cameraOutline, closeOutline, documentOutline, imageOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';

type FileAccept =
  | '.avi'
  | '.jpeg'
  | '.jpg'
  | '.mkv'
  | '.mov'
  | '.mp4'
  | '.pdf'
  | '.png'
  | '.webm'
  | '.webp';

type UploadedFile = {
  file: File | null;
  preview: string | null;
  name?: string;
  isExternal?: boolean;
};

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [IonNote, IonText, IonLabel, IonFab, IonFabButton, IonIcon, ButtonComponent],
})
export class FileUploadComponent implements OnDestroy {
  accept = input<FileAccept[]>([]);
  fileUrl = input<string[] | string | null>(null);
  label = input<string>('Upload File');
  maxFileSizeMB = input<number>(5);
  multiple = input<boolean>(false);
  showPreview = input<boolean>(true);
  fullWidth = input<boolean>(false);

  filesChange = output<File[]>();
  urlRemoved = output<string[] | string | null>();

  errorMessage = signal<string | null>(null);
  isDragOver = signal(false);
  uploadedFiles = signal<UploadedFile[]>([]);

  acceptedTypes = computed(() => this.accept().join(','));
  displayFiles = computed(() => {
    if (this.uploadedFiles().length) {
      return this.uploadedFiles();
    }

    return this.externalFiles();
  });
  externalFiles = computed<UploadedFile[]>(() => {
    const value = this.fileUrl();

    if (!value) return [];

    const urls = Array.isArray(value) ? value : [value];

    return urls.map((url) => ({
      file: null,
      preview: url,
      name: this.getFileName(url),
      isExternal: true,
    }));
  });

  constructor() {
    addIcons({
      cameraOutline,
      closeOutline,
      imageOutline,
      documentOutline,
    });
  }

  ngOnDestroy(): void {
    this.clearPreviewUrls();
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();

    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();

    this.isDragOver.set(false);

    const files = Array.from(e.dataTransfer?.files ?? []);

    this.handleFileUpload(files);
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;

    const files = Array.from(input.files ?? []);

    input.value = '';

    this.handleFileUpload(files);
  }

  openFilePicker(input: HTMLInputElement): void {
    input.click();
  }

  removeFile(index: number): void {
    const uploaded = [...this.uploadedFiles()];
    const external = [...this.externalFiles()];

    if (uploaded.length) {
      const removed = uploaded[index];

      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }

      uploaded.splice(index, 1);

      this.uploadedFiles.set(uploaded);

      this.filesChange.emit(uploaded.map((f) => f.file).filter((f): f is File => !!f));

      return;
    }

    external.splice(index, 1);

    const updatedUrls = external.map((f) => f.preview).filter((url): url is string => !!url);

    this.urlRemoved.emit(this.multiple() ? updatedUrls : (updatedUrls[0] ?? null));
  }

  handleFileUpload(files: File[]): void {
    if (!files.length) return;

    this.errorMessage.set(null);

    const validFiles: UploadedFile[] = [];

    for (const file of files) {
      const isAccepted = this.validateFileType(file);

      if (!isAccepted) {
        this.errorMessage.set(`Invalid file type: ${file.name}`);

        continue;
      }

      const isValidSize = this.validateFileSize(file);

      if (!isValidSize) {
        this.errorMessage.set(`${file.name} exceeds ${this.maxFileSizeMB()}MB`);

        continue;
      }

      const isDuplicate = this.uploadedFiles().some(
        (f) => f.file?.name === file.name && f.file?.size === file.size,
      );

      if (isDuplicate) continue;

      validFiles.push({
        file,
        preview: this.createPreview(file),
        name: file.name,
      });
    }

    if (!validFiles.length) return;

    if (!this.multiple()) {
      this.clearPreviewUrls();

      this.uploadedFiles.set([validFiles[0]]);
    } else {
      this.uploadedFiles.update((prev) => [...prev, ...validFiles]);
    }

    this.filesChange.emit(
      this.uploadedFiles()
        .map((f) => f.file)
        .filter((f): f is File => !!f),
    );
  }

  private validateFileType(file: File): boolean {
    const accepted = this.accept();

    if (!accepted.length) return true;

    return accepted.some((type) => file.name.toLowerCase().endsWith(type));
  }

  private validateFileSize(file: File): boolean {
    const maxBytes = this.maxFileSizeMB() * 1024 * 1024;

    return file.size <= maxBytes;
  }

  private createPreview(file: File): string | null {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    return URL.createObjectURL(file);
  }

  private clearPreviewUrls(): void {
    for (const file of this.uploadedFiles()) {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    }
  }

  private getFileName(url: string): string {
    return url.split('/').pop() ?? 'File';
  }

  isImage(item: UploadedFile): boolean {
    if (item.file) {
      return item.file.type.startsWith('image/');
    }

    if (item.preview) {
      return /\.(png|jpg|jpeg|gif|webp)$/i.test(item.preview);
    }

    return false;
  }
}
