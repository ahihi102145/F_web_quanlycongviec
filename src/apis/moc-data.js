export const mockData = {
    board: {
      _id: 'board-id-01',
      title: 'Ftel',
      description: 'Quan ly cong viec  ',
      type: 'public', // 'private'
      ownerIds: [], // Những users là Admin của board
      memberIds: [], // Những users là member bình thường của board
      columnOrderIds: ['column-id-01', 'column-id-02', 'column-id-03','column-id-04'], // Thứ tự sắp xếp / vị trí của các Columns trong 1 boards
      columns: [
        {
          _id: 'column-id-01',
          boardId: 'board-id-01',
          title: 'To Do Column 01',
          cardOrderIds: ['card-id-01', 'card-id-02', 'card-id-03', 'card-id-04', 'card-id-05', 'card-id-06', 'card-id-07'],
          cards: [
            {
              _id: 'card-id-01',
              boardId: 'board-id-01',
              columnId: 'column-id-01',
              title: 'Title of card 01',
              description: 'Markdown Syntax (sẽ ở khóa nâng cao nhé)',
              cover: 'data:image/png;base64,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',
              memberIds: ['test-user-id-01'],
              comments: ['test comment 01', 'test comment 02'],
              attachments: ['test attachment 01', 'test attachment 02', 'test attachment 03']
            },
            { _id: 'card-id-02', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 02', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-03', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 03', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-04', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 04', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-05', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 05', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-06', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 06', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-07', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 07', description: null, cover: null, memberIds: [], comments: [], attachments: [] }
          ]
        },
        {
          _id: 'column-id-02',
          boardId: 'board-id-01',
          title: 'Inprogress Column 02',
          cardOrderIds: ['card-id-08', 'card-id-09', 'card-id-10'],
          cards: [
            { _id: 'card-id-08', boardId: 'board-id-01', columnId: 'column-id-02', title: 'Title of card 08', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-09', boardId: 'board-id-01', columnId: 'column-id-02', title: 'Title of card 09', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-10', boardId: 'board-id-01', columnId: 'column-id-02', title: 'Title of card 10', description: null, cover: null, memberIds: [], comments: [], attachments: [] }
          ]
        },
        {
          _id: 'column-id-03',
          boardId: 'board-id-01',
          title: 'Done Column 03',
          cardOrderIds: ['card-id-11', 'card-id-12', 'card-id-13'],
          cards: [
            { _id: 'card-id-11', boardId: 'board-id-01', columnId: 'column-id-03', title: 'Title of card 11', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-12', boardId: 'board-id-01', columnId: 'column-id-03', title: 'Title of card 12', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
            { _id: 'card-id-13', boardId: 'board-id-01', columnId: 'column-id-03', title: 'Title of card 13', description: null, cover: null, memberIds: [], comments: [], attachments: [] }
          ]
        },
        {
          _id: 'column-id-04',
          boardId: 'board-id-01',
          title: 'empty 04',
          /**
         * Video 37.2: Cách xử lý bug logic thư viện DnD-kit khi Column là rỗng:
         * Phía FE sẽ tự tạo ra một cái card đặc biệt: Placeholder Card, không liên quan tới Back-end
         * Card đặc biệt này sẽ được ẩn ở giao diện UI người dùng.
         * Cấu trúc Id của cái card này phải unique rất đơn giản, không cần phải làm random phức tạp:
         * "columnId-placeholder-card" (mỗi column chỉ có thể có tối đa một cái Placeholder Card)
         * Quan trọng khi tạo phải đầy đủ: {_id, boardId, columnId, FE_PlaceholderCard}
         * Kỹ hơn nữa và cách tạo chuẩn ở bước nào thì sẽ ở học phần tích hợp API Back-end vào dự án. (bởi vì đây là file mock-data)
         */

          cardOrderIds: ['card-id-04_placeholder_card'],
          cards: [
            { _id: 'card-id-04_placeholder_card', 
              boardId: 'board-id-01', 
              columnId: 'column-id-04' ,
              FE_PlaceholderCard:true
            }]
        }
      ]
    }
  }