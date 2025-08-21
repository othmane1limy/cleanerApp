import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guard';
import { UserRole } from '@cleaning-marketplace/shared';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile/client')
  @ApiOperation({ summary: 'Update client profile' })
  @ApiResponse({ status: 200, description: 'Client profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @Roles(UserRole.CLIENT)
  @UseGuards(RoleGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        avatarUrl: { type: 'string' },
        defaultLocationId: { type: 'string' },
      },
    },
  })
  async updateClientProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.updateClientProfile(req.user.id, updateData);
  }

  @Put('profile/cleaner')
  @ApiOperation({ summary: 'Update cleaner profile' })
  @ApiResponse({ status: 200, description: 'Cleaner profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        businessName: { type: 'string' },
        bio: { type: 'string' },
        baseLocationId: { type: 'string' },
        active: { type: 'boolean' },
      },
    },
  })
  async updateCleanerProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.updateCleanerProfile(req.user.id, updateData);
  }

  @Put('cleaner/availability')
  @ApiOperation({ summary: 'Update cleaner availability status' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        active: { type: 'boolean' },
      },
      required: ['active'],
    },
  })
  async updateAvailability(@Request() req: any, @Body() body: { active: boolean }) {
    return this.usersService.updateCleanerAvailability(req.user.id, body.active);
  }

  @Put('cleaner/location')
  @ApiOperation({ summary: 'Update cleaner live location' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot update location while inactive' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lat: { type: 'number', minimum: -90, maximum: 90 },
        lng: { type: 'number', minimum: -180, maximum: 180 },
      },
      required: ['lat', 'lng'],
    },
  })
  async updateLocation(
    @Request() req: any,
    @Body() body: { lat: number; lng: number }
  ) {
    return this.usersService.updateCleanerLocation(req.user.id, body.lat, body.lng);
  }

  @Post('cleaner/documents')
  @ApiOperation({ summary: 'Upload verification document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'],
        },
      },
    },
  })
  async uploadDocument(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { type: string }
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // In a real implementation, you would upload to cloud storage (AWS S3, etc.)
    const documentData = {
      type: body.type,
      url: `/uploads/documents/${file.filename}`, // Placeholder URL
    };

    return this.usersService.uploadVerificationDocument(req.user.id, documentData);
  }

  @Get('cleaner/documents')
  @ApiOperation({ summary: 'Get verification documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  async getDocuments(@Request() req: any) {
    return this.usersService.getVerificationDocuments(req.user.id);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @Roles(UserRole.CLIENT)
  @UseGuards(RoleGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        lat: { type: 'number', minimum: -90, maximum: 90 },
        lng: { type: 'number', minimum: -180, maximum: 180 },
        addressText: { type: 'string' },
      },
      required: ['label', 'lat', 'lng', 'addressText'],
    },
  })
  async createLocation(@Request() req: any, @Body() locationData: any) {
    return this.usersService.createLocation(req.user.id, locationData);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get user locations' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  @Roles(UserRole.CLIENT)
  @UseGuards(RoleGuard)
  async getLocations(@Request() req: any) {
    return this.usersService.getUserLocations(req.user.id);
  }

  @Delete('locations/:locationId')
  @ApiOperation({ summary: 'Delete a location' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete default location' })
  @Roles(UserRole.CLIENT)
  @UseGuards(RoleGuard)
  async deleteLocation(@Request() req: any, @Param('locationId') locationId: string) {
    return this.usersService.deleteLocation(req.user.id, locationId);
  }

  @Get('cleaner/stats')
  @ApiOperation({ summary: 'Get cleaner statistics and dashboard data' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  @Roles(UserRole.CLEANER)
  @UseGuards(RoleGuard)
  async getCleanerStats(@Request() req: any) {
    return this.usersService.getCleanerStats(req.user.id);
  }

  @Get('cleaners/search')
  @ApiOperation({ summary: 'Search for cleaners near location' })
  @ApiResponse({ status: 200, description: 'Cleaners retrieved successfully' })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'serviceType', required: false, type: String })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  async searchCleaners(@Query() filters: any) {
    return this.usersService.searchCleaners(filters);
  }
}
