import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuotableService } from './quotable.service';
import * as quotable from 'src/DTO/quotable';

@Controller()
export class QuotableController {
  constructor(private readonly appService: QuotableService) { }

  @Post('api/quotable')
  postQuotable(@Body() endpoint: quotable.QuoteBody) {
    return this.appService.getQuotes(endpoint);
  }
}
