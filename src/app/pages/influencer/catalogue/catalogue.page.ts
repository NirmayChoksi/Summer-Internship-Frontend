import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, MediaTypeSelection } from '@capacitor/camera';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkCircle,
  closeOutline,
  playCircle,
  trashOutline,
} from 'ionicons/icons';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { Catalogue } from './model/interfaces';
import { CatalogueService } from './services/catalogue';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.page.html',
  styleUrls: ['./catalogue.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ButtonComponent,
  ],
})
export class CataloguePage implements OnInit {
  private catalogueService = inject(CatalogueService);

  private longPressTimeout?: ReturnType<typeof setTimeout>;

  catalogues = signal<Catalogue[]>([]);
  selectedCatalogue = signal<Catalogue | null>(null);
  isPreviewModalOpen = signal(false);
  isSelectionMode = signal(false);
  selectedCatalogueIds = signal<Set<string>>(new Set());

  constructor() {
    addIcons({ addOutline, playCircle, closeOutline, checkmarkCircle, trashOutline });
  }

  ngOnInit() {
    this.loadCatalogues();
  }

  loadCatalogues() {
    this.catalogueService.getMyCatalogues().subscribe({
      next: ({ catalogues }) => {
        this.catalogues.set(catalogues);
      },
      error: console.error,
    });
  }

  openCatalogue(item: Catalogue) {
    this.selectedCatalogue.set(item);
    this.isPreviewModalOpen.set(true);
  }

  closePreviewModal() {
    this.isPreviewModalOpen.set(false);
    this.selectedCatalogue.set(null);
  }

  onPressStart(item: Catalogue) {
    this.longPressTimeout = setTimeout(() => {
      this.enterSelectionMode(item);
    }, 500);
  }

  onPressEnd() {
    clearTimeout(this.longPressTimeout);
  }

  enterSelectionMode(item: Catalogue) {
    this.isSelectionMode.set(true);

    this.selectedCatalogueIds.set(new Set([item._id]));
  }

  toggleSelection(item: Catalogue) {
    const selected = new Set(this.selectedCatalogueIds());

    if (selected.has(item._id)) {
      selected.delete(item._id);
    } else {
      selected.add(item._id);
    }

    this.selectedCatalogueIds.set(selected);

    if (selected.size === 0) {
      this.isSelectionMode.set(false);
    }
  }

  cancelSelection() {
    this.isSelectionMode.set(false);
    this.selectedCatalogueIds.set(new Set());
  }

  onCatalogueClick(item: Catalogue) {
    if (this.isSelectionMode()) {
      this.toggleSelection(item);
      return;
    }

    this.openCatalogue(item);
  }

  async addCatalogue() {
    try {
      const permissions = await Camera.checkPermissions();

      if (permissions.photos !== 'granted' && permissions.photos !== 'limited') {
        await Camera.requestPermissions({
          permissions: ['photos'],
        });
      }

      const { results } = await Camera.chooseFromGallery({
        limit: 5,
        allowMultipleSelection: true,
        mediaType: MediaTypeSelection.All,
      });

      const formData = new FormData();

      for (const item of results) {
        if (!item.webPath) continue;

        const response = await fetch(item.webPath);

        const blob = await response.blob();

        formData.append('catalogues', blob, `catalogue-${Date.now()}.${blob.type.split('/')[1]}`);
      }

      this.catalogueService.uploadCatalogues(formData).subscribe({
        next: ({ catalogues }) => {
          this.catalogues.update((current) => [...catalogues, ...current]);
        },
        error: console.error,
      });
    } catch (e) {
      console.error(e);
    }
  }

  deleteSelected() {
    const ids = Array.from(this.selectedCatalogueIds());

    if (!ids.length) return;

    this.catalogueService.deleteManyCatalogues(ids).subscribe({
      next: () => {
        this.catalogues.update((catalogues) =>
          catalogues.filter((catalogue) => !this.selectedCatalogueIds().has(catalogue._id)),
        );

        this.cancelSelection();
      },
      error: console.error,
    });
  }
}
