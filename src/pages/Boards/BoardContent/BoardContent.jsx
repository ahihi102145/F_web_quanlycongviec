import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

import { 
    DndContext,
    //PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    closestCorners,
   // closestCenter,
    pointerWithin,
   // rectIntersection,
    getFirstCollision
} from '@dnd-kit/core'
import {arrayMove} from '@dnd-kit/sortable'
import {  useEffect, useState,useCallback, useRef } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utitls/formatters'
import {MouseSensor ,TouchSensor} from '~/customLibraries/DndKitSensors'


const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN :'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD:'ACTIVE_DRAG_ITEM_TYPE_CARD'
}


function BoardContent({board,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferenceColumn,

}) {
  
    //const pointerSensor =useSensor(PointerSensor,{activationConstraintP:{distance :10}})
    //yêu cầu chuột di chuyển 10px thì mới kích hoạt event ,fix trường hợp click bị gọi event
    const mouseSensor =useSensor(MouseSensor,{activationConstraint:{distance :10}})
    //nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích thoại event
    const touchSensor =useSensor(TouchSensor,{activationConstraint :{delay :250,tolerance :500}})

    //ưu tiên sd kết hợp cả ư mouse và touch để có trải nghiệm trên mobile tốt nhất , k bị bug
    //const sensors = useSensors(pointerSensor)
    const sensors = useSensors(mouseSensor,touchSensor)

    const [orderedColumns ,setOrderedColumns] = useState([])

    //cùng  1 thời điển chỉ có 1 phân tử đc kéo (column hoặc card)
    const [activeDragItemId ,setActiveDragItemId] = useState(null)
    const [activeDragItemIdType ,setActiveDragItemIdType] = useState(null)
    const [activeDragItemData ,setActiveDragItemData] = useState(null)
    const [oldColumnWhenDraggingCard ,setOldColumnWhenDraggingCard] = useState(null)

    //diem va cham cuoi cung trc do
    const lastOverId =useRef(null)

    useEffect(() => {
      // column đã đc sx ở compoment cha cao nhất(71)
      setOrderedColumns(board.columns)
    }, [board])
    

        //tim column theo cardId
    const findColumnByCardId =(cardId) =>{
//đoạn này lên dùng c.cards thay vì c.cardOrderIds vì ở bước  handleDragOver sẽ làm data cho cards hoàn chỉnh rồi mới tạo cardOrderIds mới       
        return orderedColumns.find(column =>column.cards.map(card =>card._id)?.includes(cardId))
    }
// khởi tạo Func  xử lý việc cap nhat lai state trong truong hop di chyen Card giua cac column khac nhau
    const moveCardBetweenDifferentColumns  =(
      overColumn,
      overCardId,
      active,
      over,
      activeColumn,
      activeDraggingCardData,
      activeDraggingCardId,
      triggerFrom 
    )=>{
      setOrderedColumns(prevColumns => {
        // Tìm vị trí của overCard trong column đích nơi mà activeCard sắp được thả
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
  
        let newCardIndex
        // Kiểm tra nếu thả xuống dưới hay lên trên so với overCard
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length+1
  
        // Clone mảng orderedColumns state cũ ra một cái mới để xử lý data rồi return (cập nhật lại state)
        const nextColumns = cloneDeep(prevColumns)
  
        // Tìm column cũ và column mới trong bản clone
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
  
        // Xử lý column cũ: xóa card đang kéo ra khỏi column cũ
        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId);
          
        //them placeholder card neu column rong  : bi keo het card di , k con cai nao nua (37.2)
        if(isEmpty(nextActiveColumn.cards)){
          console.log ('card cuoi cung bi keo di')
          nextActiveColumn.cards=[generatePlaceholderCard(nextActiveColumn)]
        }
          
        // Cập nhật lại mảng cardOrderIds cho chuẩn data
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
  
        // Xử lý column mới: chèn card đang kéo vào vị trí mới
        if (nextOverColumn) {
          // Xóa nếu card kéo đã tồn tại trong column mới (tránh bị nhân bản)
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId);
          
          //xoa placeholder card di neu no dang ton tai(37.2)
          nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
          
          // Thêm card đang kéo vào column mới theo đúng vị trí mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, {...activeDraggingCardData,columnId:nextOverColumn._id})
          // Cập nhật lại mảng cardOrderIds cho chuẩn data
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        // nếu func này đc gọi từ handleDragEnd  nghĩa là đã kéo thả song , lúc này mới  xử lý  gọi api 1 lần ở đây 
        if(triggerFrom === 'handleDragEnd'){
        /**
         * Gọi props hàm moveCardToDifferentColumn  từ component cha cao nhất (boards/_id.jsx).
         * Lưu ý:
         * - Trong các phần nâng cao của khóa học MERN Stack, chúng ta sẽ đưa dữ liệu `Board` ra ngoài Redux Global Store.
         * - Khi đó, việc gọi API sẽ được thực hiện từ trên xuống (từ component cha), thay vì gọi ngược lên từ các component con.
         *   (Càng dùng component ở mức cao hơn để xử lý, code càng dễ kiểm soát và mở rộng hơn.)
         * - Sử dụng Redux theo hướng này sẽ giúp code gọn gàng, chuẩn hóa và dễ bảo trì hơn.
         * Quan trọng:
         * - Cần truyền `activeDragItemData.columnId` hoặc ít nhất là `oldColumnWhenDraggingCard._id` 
         *(được set từ bước `handleDragStart`), vì `activeData` trong phạm vi `handleDragEnd` sẽ không còn chính xác
         *do state liên quan tới card đã được cập nhật một lần trong `onDragOver`.
         */
  
          moveCardToDifferenceColumn(
            activeDraggingCardId ,
            oldColumnWhenDraggingCard._id,
            nextOverColumn._id,
            nextColumns
          )
        }

        return nextColumns
      })
    }

    //trigger keo 1 phan tu
    const handleDragStart= (event) =>{
        setActiveDragItemId(event?.active?.id)
        setActiveDragItemIdType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :ACTIVE_DRAG_ITEM_TYPE.COLUMN ) 
        setActiveDragItemData(event?.active?.data?.current)

          //neu la keo card thi moi thuc hien hanh dong set gia tri oldCoulmn
        if(event?.active?.data?.current){
        setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))

        }
    } 

    //trigger  trong quá trình keo 1 phan tu
    const handleDragOver = (event) => {
        // Không làm gì thêm nếu đang kéo column (nếu cần chặn kéo Column thì mở dòng dưới)
        if (activeDragItemIdType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
      
        const { active, over } = event
      
        // Đảm bảo nếu không tồn tại active hoặc over thì không làm gì (tránh crash trang)
        if (!active || !over) return
      
        // Lấy thông tin Card đang được kéo
        const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
        const  {id : overCardId } = over
        // Xác định xem over là Card hay Column
        //const isOverCard = over?.data?.current?.columnId
        //const overCardId = isOverCard ? over.id : null
      
        // Tìm column chứa card đang được kéo
        const activeColumn = findColumnByCardId(activeDraggingCardId)
        // Tìm column chứa card đang hover
        const overColumn = overCardId ? findColumnByCardId(overCardId) : orderedColumns.find(column => column._id === over.id)// Nếu không phải Card thì over là Column
      
        // Nếu không tìm thấy activeColumn hoặc overColumn thì return
        if (!activeColumn || !overColumn) return
      
        // Chỉ xử lý logic khi kéo card sang column khác (nếu kéo trong cùng column thì không làm gì)
        if (activeColumn._id !== overColumn._id) {
          moveCardBetweenDifferentColumns (
            overColumn,
            overCardId,
            active,
            over,
            activeColumn,
            activeDraggingCardData,
            activeDraggingCardId,
            'handleDragOver'
          )
        }
    }
      
    //trigger khi keets thucs hành động kéo 1 phan tu
    const handleDragEnd= (event) =>{
        const {active,over} =event
        //kiểm tra nếu ko tồn tại over(khéo ra ngoài) thì return luôn tránh lỗi
        if(!over || !active) return 
        
        //xu lý kéo thả card
        if(activeDragItemIdType===ACTIVE_DRAG_ITEM_TYPE.CARD){
          const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
          const  {id : overCardId } = over
          // Xác định xem over là Card hay Column
          //const isOverCard = over?.data?.current?.columnId
          //const overCardId = isOverCard ? over.id : null
        
          // Tìm column chứa card đang được kéo
          const activeColumn = findColumnByCardId(activeDraggingCardId);
          // Tìm column chứa card đang hover
          const overColumn = overCardId ? findColumnByCardId(overCardId) : orderedColumns.find(column => column._id === over.id); // Nếu không phải Card thì over là Column
        
          // Nếu không tìm thấy activeColumn hoặc overColumn thì return
          if (!activeColumn || !overColumn) return 
            
          // kéo card qua 2 column khác nhau
          //phải dùng tới oldColumnWhenDraggingCard hoặc  (set vào state từ bước handleStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDargOver tới đây state đẫ bị cập nhật 1 lần r

          if (oldColumnWhenDraggingCard._id !== overColumn._id){
            moveCardBetweenDifferentColumns (
              overColumn,
              overCardId,
              active,
              over,
              activeColumn,
              activeDraggingCardData,
              activeDraggingCardId,
              'handleDragEnd'
            )    
          }else{
            // hành động kéo thả card trong cùng 1 column

            // vị trí cũ (từ oldColumnWhenDraggingCard )
            const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
            // console.log('oldCardIndex :',oldCardIndex)
            //vị trí mới (từ overColumn)
            const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
            // console.log('newCardIndex :',newCardIndex)
            // arrayMove ở đây tương tư như logic kéo các column
            const  dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards,oldCardIndex,newCardIndex)
            //van goi update state o day de tranh delay hoac Flickering giao dien luc keo tha can phai cho goi api 

            const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

            setOrderedColumns(prevColumns => {
              // Clone mảng orderedColumns state cũ ra một cái mới để xử lý data rồi return (cập nhật lại state)
            const nextColumns = cloneDeep(prevColumns)

            //tim toi column dang tha
            const targetColumn = nextColumns.find(column => column._id === overColumn._id)
              //cap nhat lai 2 gia tri moi la card va cardOrderIds trong targetColumn
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCardIds
            
            
              // tra ve gia tri state moi (chuan vi tri)
            return nextColumns
            })
            /**
           * Gọi lên props function moveCardInTheSameColumn nằm ở component cha cao nhất (boards/_id.jsx)
           * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ đưa 
           * dữ liệu Board ra ngoài Redux Global Store,
           * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những 
           * component cha phía bên trên. (đối với component con nằm càng sâu thì càng khổ :D)
           * – Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
           */

            moveCardInTheSameColumn(dndOrderedCards,dndOrderedCardIds,oldColumnWhenDraggingCard._id)

          }
        }
       
        //xu ly keo tha column
        if(activeDragItemIdType===ACTIVE_DRAG_ITEM_TYPE.COLUMN){

        // nếu vị trí sau khi kéo thả khác vị trí ban đầu
        if(active.id !== over.id){
            //lấy vị trí cũ từ active
            const oldColumnIndex = orderedColumns.findIndex(c =>c._id === active.id)
            //lấy vị trí mới từ active
            const newColumnIndex = orderedColumns.findIndex(c =>c._id === over.id)

            // arrayMove của dnd-kit  sắp xếp lại mảng cloumns ban đầu
            const  dndOrderedColumns = arrayMove(orderedColumns,oldColumnIndex,newColumnIndex)
          
           // van goi update state o day de tranh delay hoac Flickering giao dien luc keo tha can cho goi api (small strick)
          setOrderedColumns(dndOrderedColumns)   
            
            /**
             * Gọi hàm moveColumns được truyền từ component cha cấp cao nhất (boards/_id.jsx).
             * Lưu ý:
             * - Trong phần học nâng cao (MERN Stack Advanced), chúng ta sẽ quản lý dữ liệu board ra ngoai qua Redux Global Store.
             * - Khi đó, các thao tác như cập nhật column/card sẽ thực hiện thông qua dispatch action, không cần truyền props ngược lên như hiện tại.
             * - Việc sử dụng Redux giúp code sạch hơn, dễ bảo trì, và tránh việc prop-drilling qua nhiều cấp component.  
             */
            moveColumns(dndOrderedColumns)

         
            
        } if (activeDragItemIdType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
           // console.log('Kéo Card từ', active.data.current, 'sang', over.data.current);
          }

        // những data sau khi kéo thả này luôn pk đưa về value null mặc định ban đầu  
        setActiveDragItemId(null)
        setActiveDragItemIdType(null)
        setActiveDragItemData(null)
        }
}
    const customDropAnimation = {
        sideEffects : defaultDropAnimationSideEffects({styles:{active:{opacity:'0.5' }}})
    }

    //args =argument :các đối số , tham số
    const collisionDetectionStrategy = useCallback((args) => {
      if(activeDragItemIdType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
        return closestCorners({...args})
      }

      //tìm các điểm giao nhau,va chạm
      const pointerIntersections =pointerWithin(args)
      //neu pointerIntersections la mang rong return luon
      //fix triet de bug flicering cua thu vien dnd trong trg hop sau :
      //keo card image cover va keo len phia cung khu vuc keo tha
      if(!pointerIntersections?.length) return
      //const intersections = !!pointerIntersections?.length ?pointerIntersections :rectIntersection(args)

      //tìm overId đầu tiên 
      let overId = getFirstCollision(pointerIntersections,'id')
      //console.log('overid',overId)
      if(overId){

        const checkColumn =orderedColumns.find(c =>c._id === overId)
        if(checkColumn){
          overId=closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(container =>{
              return (container.id !==overId) &&(checkColumn?.cardOrderIds?.includes(container.id))
         })
          })[0]?.id
        }


        lastOverId.current =overId 
        return [{id : overId}]
      }

        // neu overid null thi tra ve  mang rong
      return lastOverId.current ? [{ id: lastOverId.current}] : []
},[activeDragItemIdType, orderedColumns])


    return (
        <DndContext 
        //cảm biến (vd số 30)
        sensors={sensors}
        //thuật toán phát hiện va chạm (nếu k có thì card với cover lớn sẽ ko kéo qua Column đc vì lúc này nó đang bị conflic giữa card với column)
        //collisionDetection={closestCorners}
        // tu custom thuat toan va cham (vd 37)
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        
        >
            <Box
            sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                width: '100%',
                height: (theme) => theme.trelloCustom.boardContentHeight,
                p:'10px 0', 
            }}>
            <ListColumns columns={orderedColumns} />      
            <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemIdType && null}
          {activeDragItemIdType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemIdType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
        </Box>
        </DndContext>
    )
}

export default BoardContent
