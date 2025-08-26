import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Subject } from 'src/app/interfaces/subject.interface';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  subscribedSubjectIds: Set<number> = new Set();
  isDataLoaded: boolean = false;
  unsubscribeForms: { [key: number]: FormGroup } = {};

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadSubjectsAndUserSubscription();
  }

  loadSubjectsAndUserSubscription(): void {
    this.subjectService.getAllSubjects().subscribe((subjectsData) => {
      this.subjects = subjectsData;

      this.authService.me().subscribe((user: User) => {
        if (user.subscribedSubjects) {
          user.subscribedSubjects.forEach(subject => this.subscribedSubjectIds.add(subject.id));
        }
        this.initializeForms(user.id);
        this.isDataLoaded = true;
      });
    });
  }

  initializeForms(userId: number): void {
    this.subjects.forEach(subject => {
      this.unsubscribeForms[subject.id] = this.fb.group({
        userId: [userId],
        subjectId: [subject.id]
      });
    });
  }

  isSubscribed(subjectId: number): boolean {
    return this.subscribedSubjectIds.has(subjectId);
  }

  onSubscribe(subjectId: number): void {
    const form = this.unsubscribeForms[subjectId];
    if (form) {
      const userId = form.get('userId')?.value;
      this.subscriptionService.subscribeSubject(userId, subjectId).subscribe(() => {
        this.subscribedSubjectIds.add(subjectId);
      });
    }
  }

  onUnsubscribe(subjectId: number): void {
    const form = this.unsubscribeForms[subjectId];
    if (form) {
      const userId = form.get('userId')?.value;
      this.subscriptionService.unsubscribeSubject(userId, subjectId).subscribe(() => {
        this.subscribedSubjectIds.delete(subjectId);
      });
    }
  }
}


