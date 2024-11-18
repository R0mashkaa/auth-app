import { Logger } from '@nestjs/common';

export const LoggerServiceDecorator = (): MethodDecorator => {
  const logger = new Logger();

  return (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const context = JSON.stringify(args, (key, value) => {
        if (key === 'password') {
          return '[HIDDEN]';
        }
        return value;
      });

      logger.log(
        `Service: [${this.constructor.name}] Method: {${String(propertyKey)}} Arguments: ${context}`,
      );

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
