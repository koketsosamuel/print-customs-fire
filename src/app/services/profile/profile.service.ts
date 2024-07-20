import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  collectionName = 'Profile' as const;
  constructor(private readonly db: DbService, private readonly auth: AuthService) { }

  updateProfile(profile: Object) {
    return this.db.addOrWriteToRef(this.collectionName, this.auth.user?.uid as string, profile);
  }

  getProfile() {
    return this.db.getDocumentById(this.collectionName, this.auth.user?.uid as string);
  }
}
