import { NextRequest, NextResponse } from 'next/server';
import { POST, GET } from '@/app/api/events/route';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';

// Mock all dependencies
jest.mock('@/lib/mongodb');
jest.mock('@/database/event.model');
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('POST /api/events', () => {
  let mockRequest: Partial<NextRequest>;
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormData = new FormData();
    
    // Mock NextRequest with formData method
    mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    } as Partial<NextRequest>;

    // Mock database connection
    (connectToDatabase as jest.Mock).mockResolvedValue({});
  });

  describe('Happy Path - Successful Event Creation', () => {
    it('should create an event with valid data and image', async () => {
      // Arrange
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockFormData.append('title', 'Tech Conference 2024');
      mockFormData.append('description', 'A great tech conference');
      mockFormData.append('overview', 'Learn about latest tech trends');
      mockFormData.append('venue', 'Convention Center');
      mockFormData.append('location', 'San Francisco, CA');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '09:00');
      mockFormData.append('mode', 'hybrid');
      mockFormData.append('audience', 'Developers');
      mockFormData.append('agenda', 'Opening Keynote');
      mockFormData.append('agenda', 'Workshop Session');
      mockFormData.append('organizer', 'Tech Corp');
      mockFormData.append('tags', 'technology');
      mockFormData.append('tags', 'conference');
      mockFormData.append('image', mockFile);

      const mockUploadResult = {
        secure_url: 'https://cloudinary.com/image.jpg',
        public_id: 'test-image',
      };

      // Mock cloudinary upload
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockUploadResult);
          return { end: jest.fn() };
        }
      );

      const mockCreatedEvent = {
        _id: 'event123',
        title: 'Tech Conference 2024',
        image: mockUploadResult.secure_url,
      };

      (Event.create as jest.Mock).mockResolvedValue(mockCreatedEvent);

      // Act
      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      // Assert
      expect(connectToDatabase).toHaveBeenCalledTimes(1);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({
          resource_type: 'image',
          folder: 'dev-event',
        }),
        expect.any(Function)
      );
      expect(Event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Tech Conference 2024',
          image: mockUploadResult.secure_url,
        })
      );
      expect(response.status).toBe(201);
      expect(json.message).toBe('Event created successfully');
      expect(json.event).toEqual(mockCreatedEvent);
    });

    it('should handle file buffer conversion correctly', async () => {
      const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
      mockFormData.append('title', 'Test Event');
      mockFormData.append('image', mockFile);
      mockFormData.append('description', 'Test description');
      mockFormData.append('overview', 'Test overview');
      mockFormData.append('venue', 'Test venue');
      mockFormData.append('location', 'Test location');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '10:00');
      mockFormData.append('mode', 'online');
      mockFormData.append('audience', 'All');
      mockFormData.append('agenda', 'Item 1');
      mockFormData.append('organizer', 'Organizer');
      mockFormData.append('tags', 'tag1');

      let capturedBuffer: Buffer | null = null;
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => ({
          end: (buffer: Buffer) => {
            capturedBuffer = buffer;
            callback(null, { secure_url: 'https://test.com/image.png' });
          },
        })
      );

      (Event.create as jest.Mock).mockResolvedValue({ _id: 'test' });

      await POST(mockRequest as NextRequest);

      expect(capturedBuffer).toBeInstanceOf(Buffer);
    });
  });

  describe('Error Handling - Missing Image', () => {
    it('should return 400 when image is not provided', async () => {
      // Arrange
      mockFormData.append('title', 'Event Without Image');
      mockFormData.append('description', 'Description');
      // No image appended

      // Act
      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(json.message).toBe('Image is required');
      expect(Event.create).not.toHaveBeenCalled();
    });

    it('should return 400 when image field is null', async () => {
      mockFormData.append('title', 'Event');
      mockFormData.append('image', null as any);

      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.message).toBe('Image is required');
    });
  });

  describe('Error Handling - Invalid Form Data', () => {
    it('should return 400 when formData parsing fails', async () => {
      // Arrange
      mockRequest.formData = jest.fn().mockRejectedValue(new Error('Invalid form data'));

      // Act
      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(json.message).toBe('Invalid JSON data format');
    });

    it('should handle Object.fromEntries errors gracefully', async () => {
      // Create a formData that will cause Object.fromEntries to throw
      const badFormData = {
        entries: () => {
          throw new Error('Entries error');
        },
      };
      mockRequest.formData = jest.fn().mockResolvedValue(badFormData);

      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.message).toBe('Invalid JSON data format');
    });
  });

  describe('Error Handling - Cloudinary Upload Failure', () => {
    it('should return 500 when cloudinary upload fails', async () => {
      // Arrange
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockFormData.append('title', 'Event');
      mockFormData.append('image', mockFile);
      mockFormData.append('description', 'Description');
      mockFormData.append('overview', 'Overview');
      mockFormData.append('venue', 'Venue');
      mockFormData.append('location', 'Location');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '09:00');
      mockFormData.append('mode', 'online');
      mockFormData.append('audience', 'All');
      mockFormData.append('agenda', 'Item');
      mockFormData.append('organizer', 'Org');
      mockFormData.append('tags', 'tag');

      const uploadError = new Error('Cloudinary upload failed');
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(uploadError, undefined);
          return { end: jest.fn() };
        }
      );

      // Act
      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(json.message).toBe('Event creation failed');
      expect(json.error).toBe('Cloudinary upload failed');
      expect(Event.create).not.toHaveBeenCalled();
    });

    it('should handle undefined upload result', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockFormData.append('title', 'Event');
      mockFormData.append('image', mockFile);
      mockFormData.append('description', 'Description');
      mockFormData.append('overview', 'Overview');
      mockFormData.append('venue', 'Venue');
      mockFormData.append('location', 'Location');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '09:00');
      mockFormData.append('mode', 'online');
      mockFormData.append('audience', 'All');
      mockFormData.append('agenda', 'Item');
      mockFormData.append('organizer', 'Org');
      mockFormData.append('tags', 'tag');

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, undefined);
          return { end: jest.fn() };
        }
      );

      (Event.create as jest.Mock).mockResolvedValue({ _id: 'test' });

      const response = await POST(mockRequest as NextRequest);

      expect(Event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          image: '',
        })
      );
      expect(response.status).toBe(201);
    });
  });

  describe('Error Handling - Database Errors', () => {
    it('should return 500 when database connection fails', async () => {
      // Arrange
      (connectToDatabase as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(json.message).toBe('Event creation failed');
      expect(json.error).toBe('Database connection failed');
    });

    it('should return 500 when Event.create fails', async () => {
      // Arrange
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockFormData.append('title', 'Event');
      mockFormData.append('image', mockFile);
      mockFormData.append('description', 'Description');
      mockFormData.append('overview', 'Overview');
      mockFormData.append('venue', 'Venue');
      mockFormData.append('location', 'Location');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '09:00');
      mockFormData.append('mode', 'online');
      mockFormData.append('audience', 'All');
      mockFormData.append('agenda', 'Item');
      mockFormData.append('organizer', 'Org');
      mockFormData.append('tags', 'tag');

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, { secure_url: 'https://test.com/image.jpg' });
          return { end: jest.fn() };
        }
      );

      (Event.create as jest.Mock).mockRejectedValue(
        new Error('Validation failed')
      );

      // Act
      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(json.message).toBe('Event creation failed');
      expect(json.error).toBe('Validation failed');
    });

    it('should handle non-Error exceptions', async () => {
      (connectToDatabase as jest.Mock).mockRejectedValue('String error');

      const response = await POST(mockRequest as NextRequest);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.error).toBe('Unknown error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large image files', async () => {
      const largeContent = new Uint8Array(10 * 1024 * 1024); // 10MB
      const mockFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      mockFormData.append('title', 'Event');
      mockFormData.append('image', mockFile);
      mockFormData.append('description', 'Description');
      mockFormData.append('overview', 'Overview');
      mockFormData.append('venue', 'Venue');
      mockFormData.append('location', 'Location');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '09:00');
      mockFormData.append('mode', 'online');
      mockFormData.append('audience', 'All');
      mockFormData.append('agenda', 'Item');
      mockFormData.append('organizer', 'Org');
      mockFormData.append('tags', 'tag');

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, { secure_url: 'https://test.com/large.jpg' });
          return { end: jest.fn() };
        }
      );

      (Event.create as jest.Mock).mockResolvedValue({ _id: 'test' });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(201);
    });

    it('should handle multiple agenda items', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockFormData.append('agenda', 'Item 1');
      mockFormData.append('agenda', 'Item 2');
      mockFormData.append('agenda', 'Item 3');
      mockFormData.append('title', 'Event');
      mockFormData.append('image', mockFile);
      mockFormData.append('description', 'Description');
      mockFormData.append('overview', 'Overview');
      mockFormData.append('venue', 'Venue');
      mockFormData.append('location', 'Location');
      mockFormData.append('date', '2024-12-01');
      mockFormData.append('time', '09:00');
      mockFormData.append('mode', 'online');
      mockFormData.append('audience', 'All');
      mockFormData.append('organizer', 'Org');
      mockFormData.append('tags', 'tag');

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, { secure_url: 'https://test.com/image.jpg' });
          return { end: jest.fn() };
        }
      );

      (Event.create as jest.Mock).mockResolvedValue({ _id: 'test' });

      await POST(mockRequest as NextRequest);

      // FormData.entries() converts repeated keys to arrays automatically
      expect(Event.create).toHaveBeenCalled();
    });
  });
});

describe('GET /api/events', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (connectToDatabase as jest.Mock).mockResolvedValue({});
  });

  describe('Happy Path - Successful Fetch', () => {
    it('should fetch all events successfully', async () => {
      // Arrange
      const mockEvents = [
        {
          _id: 'event1',
          title: 'Event 1',
          slug: 'event-1',
          createdAt: new Date('2024-01-01'),
        },
        {
          _id: 'event2',
          title: 'Event 2',
          slug: 'event-2',
          createdAt: new Date('2024-01-02'),
        },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockEvents);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      (Event.find as jest.Mock) = mockFind;

      // Act
      const response = await GET();
      const json = await response.json();

      // Assert
      expect(connectToDatabase).toHaveBeenCalledTimes(1);
      expect(Event.find).toHaveBeenCalledWith();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(response.status).toBe(200);
      expect(json.message).toBe('Events fetched successfully');
      expect(json.events).toEqual(mockEvents);
    });

    it('should return empty array when no events exist', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      (Event.find as jest.Mock) = mockFind;

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.events).toEqual([]);
      expect(json.events).toHaveLength(0);
    });

    it('should sort events by createdAt in descending order', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      (Event.find as jest.Mock) = mockFind;

      await GET();

      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe('Error Handling - Database Errors', () => {
    it('should return 500 when database connection fails', async () => {
      // Arrange
      (connectToDatabase as jest.Mock).mockRejectedValue(
        new Error('Connection timeout')
      );

      // Act
      const response = await GET();
      const json = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(json.message).toBe('Events fetching failed');
      expect(json.error).toBe('Connection timeout');
    });

    it('should return 500 when Event.find fails', async () => {
      const mockSort = jest.fn().mockRejectedValue(new Error('Query failed'));
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      (Event.find as jest.Mock) = mockFind;

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.message).toBe('Events fetching failed');
      expect(json.error).toBe('Query failed');
    });

    it('should handle non-Error exceptions', async () => {
      (connectToDatabase as jest.Mock).mockRejectedValue('String error');

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.error).toBe('Unknown error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle large number of events', async () => {
      const largeEventArray = Array.from({ length: 1000 }, (_, i) => ({
        _id: `event${i}`,
        title: `Event ${i}`,
        createdAt: new Date(),
      }));

      const mockSort = jest.fn().mockResolvedValue(largeEventArray);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      (Event.find as jest.Mock) = mockFind;

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.events).toHaveLength(1000);
    });

    it('should maintain proper date ordering', async () => {
      const events = [
        { _id: '3', createdAt: new Date('2024-01-03') },
        { _id: '2', createdAt: new Date('2024-01-02') },
        { _id: '1', createdAt: new Date('2024-01-01') },
      ];

      const mockSort = jest.fn().mockResolvedValue(events);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      (Event.find as jest.Mock) = mockFind;

      const response = await GET();
      const json = await response.json();

      expect(json.events[0]._id).toBe('3');
      expect(json.events[2]._id).toBe('1');
    });
  });
});