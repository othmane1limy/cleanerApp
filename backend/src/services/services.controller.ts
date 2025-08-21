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
  ApiParam,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guard';
import { UserRole } from '@cleaning-marketplace/shared';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // ======================
  // Public Service Discovery
  // ======================

  @Get('categories')
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, description: 'Service categories retrieved successfully' })
  async getServiceCategories() {
    return this.servicesService.getServiceCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for services near location' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'serviceId', required: false, type: String })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['distance', 'price', 'rating'] })
  async searchServices(@Query() filters: any) {
    return this.servicesService.searchServices(filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get service statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getServiceStatistics() {
    return this.servicesService.getServiceStatistics();
  }

  @Get()
  @ApiOperation({ summary: 'Get all base services' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  async getServices() {
    return this.servicesService.getServices();
  }

  @Get(':serviceId')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  async getServiceById(@Param('serviceId') serviceId: string) {
    return this.servicesService.getServiceById(serviceId);
  }

  // ======================
  // Admin Service Management
  // ======================

  @Post('categories')
  @ApiOperation({ summary: 'Create service category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['name'],
    },
  })
  async createServiceCategory(@Body() categoryData: any) {
    return this.servicesService.createServiceCategory(categoryData);
  }

  @Post()
  @ApiOperation({ summary: 'Create base service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        baseDurationMin: { type: 'number' },
      },
      required: ['categoryId', 'name', 'baseDurationMin'],
    },
  })
  async createService(@Body() serviceData: any) {
    return this.servicesService.createService(serviceData);
  }

  // ======================
  // Cleaner Services Management
  // ======================

  @Get('cleaner/my-services')
  @ApiOperation({ summary: 'Get cleaner services' })
  @ApiResponse({ status: 200, description: 'Cleaner services retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  async getCleanerServices(@Request() req: any) {
    return this.servicesService.getCleanerServices(req.user.id);
  }

  @Post('cleaner/my-services')
  @ApiOperation({ summary: 'Add service to cleaner offerings' })
  @ApiResponse({ status: 201, description: 'Service added successfully' })
  @ApiResponse({ status: 400, description: 'Service already offered or invalid data' })
  @ApiResponse({ status: 403, description: 'Cannot add services while inactive' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        serviceId: { type: 'string' },
        priceMad: { type: 'number', minimum: 0 },
      },
      required: ['serviceId', 'priceMad'],
    },
  })
  async createCleanerService(@Request() req: any, @Body() serviceData: any) {
    return this.servicesService.createCleanerService(req.user.id, serviceData);
  }

  @Put('cleaner/my-services/:serviceId')
  @ApiOperation({ summary: 'Update cleaner service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'serviceId', description: 'Cleaner Service ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        priceMad: { type: 'number', minimum: 0 },
        active: { type: 'boolean' },
      },
    },
  })
  async updateCleanerService(
    @Request() req: any,
    @Param('serviceId') serviceId: string,
    @Body() updateData: any
  ) {
    return this.servicesService.updateCleanerService(req.user.id, serviceId, updateData);
  }

  @Delete('cleaner/my-services/:serviceId')
  @ApiOperation({ summary: 'Delete cleaner service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete service with active bookings' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'serviceId', description: 'Cleaner Service ID' })
  async deleteCleanerService(@Request() req: any, @Param('serviceId') serviceId: string) {
    return this.servicesService.deleteCleanerService(req.user.id, serviceId);
  }

  // ======================
  // Service Addons Management
  // ======================

  @Get('cleaner/my-services/:serviceId/addons')
  @ApiOperation({ summary: 'Get service addons' })
  @ApiResponse({ status: 200, description: 'Addons retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'serviceId', description: 'Cleaner Service ID' })
  async getServiceAddons(@Request() req: any, @Param('serviceId') serviceId: string) {
    return this.servicesService.getServiceAddons(req.user.id, serviceId);
  }

  @Post('cleaner/my-services/:serviceId/addons')
  @ApiOperation({ summary: 'Create service addon' })
  @ApiResponse({ status: 201, description: 'Addon created successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'serviceId', description: 'Cleaner Service ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        priceMad: { type: 'number', minimum: 0 },
        extraDurationMin: { type: 'number', minimum: 0 },
      },
      required: ['name', 'priceMad', 'extraDurationMin'],
    },
  })
  async createServiceAddon(
    @Request() req: any,
    @Param('serviceId') serviceId: string,
    @Body() addonData: any
  ) {
    return this.servicesService.createServiceAddon(req.user.id, serviceId, addonData);
  }

  @Put('cleaner/addons/:addonId')
  @ApiOperation({ summary: 'Update service addon' })
  @ApiResponse({ status: 200, description: 'Addon updated successfully' })
  @ApiResponse({ status: 404, description: 'Addon not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'addonId', description: 'Addon ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        priceMad: { type: 'number', minimum: 0 },
        extraDurationMin: { type: 'number', minimum: 0 },
        active: { type: 'boolean' },
      },
    },
  })
  async updateServiceAddon(
    @Request() req: any,
    @Param('addonId') addonId: string,
    @Body() updateData: any
  ) {
    return this.servicesService.updateServiceAddon(req.user.id, addonId, updateData);
  }

  @Delete('cleaner/addons/:addonId')
  @ApiOperation({ summary: 'Delete service addon' })
  @ApiResponse({ status: 200, description: 'Addon deleted successfully' })
  @ApiResponse({ status: 404, description: 'Addon not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'addonId', description: 'Addon ID' })
  async deleteServiceAddon(@Request() req: any, @Param('addonId') addonId: string) {
    return this.servicesService.deleteServiceAddon(req.user.id, addonId);
  }

  // ======================
  // Service Photos Management
  // ======================

  @Get('cleaner/my-services/:serviceId/photos')
  @ApiOperation({ summary: 'Get service photos' })
  @ApiResponse({ status: 200, description: 'Photos retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'serviceId', description: 'Cleaner Service ID' })
  async getServicePhotos(@Request() req: any, @Param('serviceId') serviceId: string) {
    return this.servicesService.getServicePhotos(req.user.id, serviceId);
  }

  @Post('cleaner/my-services/:serviceId/photos')
  @ApiOperation({ summary: 'Add service photo' })
  @ApiResponse({ status: 201, description: 'Photo added successfully' })
  @ApiResponse({ status: 400, description: 'Maximum photos limit reached' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ name: 'serviceId', description: 'Cleaner Service ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async addServicePhoto(
    @Request() req: any,
    @Param('serviceId') serviceId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Photo file is required');
    }

    // In a real implementation, you would upload to cloud storage (AWS S3, etc.)
    const photoData = {
      url: `/uploads/service-photos/${file.filename}`, // Placeholder URL
    };

    return this.servicesService.addServicePhoto(req.user.id, serviceId, photoData);
  }

  @Delete('cleaner/photos/:photoId')
  @ApiOperation({ summary: 'Delete service photo' })
  @ApiResponse({ status: 200, description: 'Photo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.CLEANER)
  @ApiParam({ name: 'photoId', description: 'Photo ID' })
  async deleteServicePhoto(@Request() req: any, @Param('photoId') photoId: string) {
    return this.servicesService.deleteServicePhoto(req.user.id, photoId);
  }
}
