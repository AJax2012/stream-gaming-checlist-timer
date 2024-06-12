import { forwardRef } from 'react';
import cn from 'classnames';
import { Separator } from './Separator';

export interface ListGroupProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const ListGroup = forwardRef<HTMLDivElement, ListGroupProps>(
  ({ className, children }, ref) => (
    <div ref={ref} role="list" className={cn('flex flex-col', className)}>
      {children}
    </div>
  )
);

ListGroup.displayName = 'ListGroup';

export interface ListGroupItemProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const ListGroupItem = forwardRef<HTMLDivElement, ListGroupItemProps>(
  ({ className, children }, ref) => (
    <>
      <div className={cn('flex', className)} ref={ref}>
        {children}
      </div>
      <Separator className="my-2 last:hidden" />
    </>
  )
);

ListGroupItem.displayName = 'ListGroupItem';

export { ListGroup, ListGroupItem };
