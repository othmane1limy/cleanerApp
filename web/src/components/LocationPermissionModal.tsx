'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { MapPin } from 'lucide-react'

interface LocationPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onRequestLocation: () => void
}

export function LocationPermissionModal({ 
  isOpen, 
  onClose, 
  onRequestLocation 
}: LocationPermissionModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center">
                <MapPin className="mr-2 text-blue-600" size={24} />
                Location Permission
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-600">
                To find the best cleaning services near you, we need access to your location. 
                This helps us:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4 mt-2 space-y-1">
                <li>Show services available in your area</li>
                <li>Calculate accurate travel times</li>
                <li>Provide better service recommendations</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Your location data is only used to improve your experience and is never shared.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onCloseModal}>
                Skip for now
              </Button>
              <Button 
                color="primary" 
                onPress={() => {
                  onRequestLocation()
                  onCloseModal()
                }}
                startContent={<MapPin size={16} />}
              >
                Allow Location
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
