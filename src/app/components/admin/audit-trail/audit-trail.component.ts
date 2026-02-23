import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import {
  alertError,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditTrailService } from 'src/app/services/audit-trail/audit-trail.service';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';
import * as moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { IPagination } from 'src/app/interfaces/IPagination';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { IAuditData } from 'src/app/interfaces/IAuditData';

@UntilDestroy()
@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss'],
})
export class AuditTrailComponent implements OnInit {
  @ViewChild('auditModal') protected auditModal!: ViewAuditComponent;

  protected readonly statusList: {
    code: string | null;
    description: string;
  }[] = [
    { code: null, description: 'All' },
    { code: 'SUCCESS', description: 'Success' },
    { code: 'FAILED', description: 'Failed' },
  ];

  protected auditList: IAuditData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auditTrailService: AuditTrailService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      username: [''],
      action: [''],
      status: [null],
      fromDate: [moment().subtract(1, 'month').toDate()],
      toDate: [new Date()],
    });
  }

  ngOnInit(): void {
    this.loadAuditTableData();
  }

  protected loadAuditTableData(): void {
    const { username, action, status, fromDate, toDate } =
      this.searchForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.auditTrailService
      .getAuditList(
        paginationRequest,
        username,
        action,
        status,
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.auditList = res.body.content.auditLogs.content || [];
            this.count = res.body.content.auditLogs.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.AUDIT_TRAIL_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadAuditTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadAuditTableData();
  }

  protected onSubmit(): void {
    this.loadAuditTableData();
  }

  protected onClear(): void {
    this.searchForm.reset({
      status: null,
      fromDate: moment().subtract(1, 'month').toDate(),
      toDate: new Date(),
    });
    this.loadAuditTableData();
  }

  protected hasAnyValue(): boolean {
    const { username, action, status, fromDate, toDate } =
      this.searchForm.value;

    return !!(username || action || status || fromDate || toDate);
  }

  protected onExport(): void {
    if (!this.auditList || this.auditList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.AUDIT_TRAIL_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.1 },
      { header: 'Username', width: 0.15 },
      { header: 'Role', width: 0.15 },
      { header: 'Action', width: 0.15 },
      { header: 'Status', width: 0.1 },
      { header: 'Date', width: 0.35 },
    ];

    const data = this.auditList.map((audit) => [
      audit.auditId.toString(),
      audit.username || '',
      audit.role || '',
      audit.action || '',
      audit.status || '',
      audit.createdAt
        ? moment(audit.createdAt).format('YYYY-MM-DD HH:mm:ss')
        : '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Audit Trail Report',
      columns: columns,
      data: data,
      filename: `Audit_Trail_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected openViewAuditModal(audit: IAuditData) {
    this.auditModal.audit = audit;
    this.auditModal.visible = true;
  }
}
