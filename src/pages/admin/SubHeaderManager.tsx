import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
} from '@mui/icons-material';
import { useSubHeader, SubMenuOption } from '../../context/SubHeaderContext';
import { useNotification } from '../../context/NotificationContext';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  option?: SubMenuOption;
  onSave: (option: SubMenuOption) => void;
  title: string;
}

interface SubItemEditDialogProps {
  open: boolean;
  onClose: () => void;
  currentValue: string;
  onSave: (value: string) => void;
  title: string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  option,
  onSave,
  title,
}) => {
  const [text, setText] = useState(option?.text || '');
  const [items, setItems] = useState<string[]>(option?.items || []);
  const [newItem, setNewItem] = useState('');

  const handleSave = () => {
    onSave({ text, items });
    onClose();
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Option Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Sub Items</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new sub item"
            />
            <Button
              variant="contained"
              onClick={handleAddItem}
              disabled={!newItem.trim()}
            >
              Add
            </Button>
          </Box>
          <List>
            {items.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!text.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SubItemEditDialog: React.FC<SubItemEditDialogProps> = ({
  open,
  onClose,
  currentValue,
  onSave,
  title,
}) => {
  const [value, setValue] = useState(currentValue);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Text"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SubHeaderManager: React.FC = () => {
  const {
    options,
    updateOptions,
    addOption,
    removeOption,
    updateOption,
    addSubItem,
    removeSubItem,
    updateSubItem,
  } = useSubHeader();
  const { showNotification } = useNotification();
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    option?: SubMenuOption;
    index?: number;
  }>({ open: false });
  const [subItemDialog, setSubItemDialog] = useState<{
    open: boolean;
    optionIndex: number;
    itemIndex: number;
    currentValue: string;
  }>({ open: false, optionIndex: 0, itemIndex: 0, currentValue: '' });

  const handleAddOption = () => {
    setEditDialog({
      open: true,
      option: { text: '', items: [] },
    });
  };

  const handleEditOption = (option: SubMenuOption, index: number) => {
    setEditDialog({
      open: true,
      option,
      index,
    });
  };

  const handleSaveOption = (newOption: SubMenuOption) => {
    if (editDialog.index !== undefined) {
      handleUpdateOption(editDialog.index, newOption);
    } else {
      addOption(newOption);
      showNotification('Option added successfully', 'success');
    }
    setEditDialog({ open: false });
  };

  const handleUpdateOption = (index: number, option: SubMenuOption) => {
    if (option.text === 'Blood Tests' || option.text === 'Specialty Tests') {
      showNotification(
        `${option.text} items are managed through their respective sections in the admin panel.`,
        'info'
      );
      return;
    }
    updateOption(index, option);
    showNotification('Menu option updated successfully', 'success');
  };

  const handleAddSubItem = (optionIndex: number) => {
    const option = options[optionIndex];
    if (option.text === 'Blood Tests' || option.text === 'Specialty Tests') {
      showNotification(
        `${option.text} items are managed through their respective sections in the admin panel.`,
        'info'
      );
      return;
    }
    const newItem = 'New Item';
    setSubItemDialog({
      open: true,
      optionIndex,
      itemIndex: option.items ? option.items.length : 0,
      currentValue: newItem,
    });
  };

  const handleSaveSubItem = (value: string) => {
    const { optionIndex, itemIndex } = subItemDialog;
    if (itemIndex === options[optionIndex].items?.length) {
      addSubItem(optionIndex, value);
    } else {
      handleUpdateSubItem(optionIndex, itemIndex, value);
    }
    setSubItemDialog({ ...subItemDialog, open: false });
  };

  const handleRemoveSubItem = (optionIndex: number, itemIndex: number) => {
    const option = options[optionIndex];
    if (option.text === 'Blood Tests' || option.text === 'Specialty Tests') {
      showNotification(
        `${option.text} items are managed through their respective sections in the admin panel.`,
        'info'
      );
      return;
    }
    removeSubItem(optionIndex, itemIndex);
    showNotification('Sub-item removed successfully', 'success');
  };

  const handleUpdateSubItem = (optionIndex: number, itemIndex: number, newText: string) => {
    const option = options[optionIndex];
    if (option.text === 'Blood Tests' || option.text === 'Specialty Tests') {
      showNotification(
        `${option.text} items are managed through their respective sections in the admin panel.`,
        'info'
      );
      return;
    }
    updateSubItem(optionIndex, itemIndex, newText);
    showNotification('Sub-item updated successfully', 'success');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Manage SubHeader Menu</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddOption}>
          Add Option
        </Button>
      </Box>

      <List component={Paper}>
        {options.map((option, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton edge="end" onClick={() => handleEditOption(option, index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => removeOption(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={option.text}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {option.items?.map((item, itemIndex) => (
                      <Chip
                        key={itemIndex}
                        label={item}
                        onDelete={() => handleRemoveSubItem(index, itemIndex)}
                        onClick={() => {
                          setSubItemDialog({
                            open: true,
                            optionIndex: index,
                            itemIndex,
                            currentValue: item,
                          });
                        }}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddSubItem(index)}
                    >
                      Add Item
                    </Button>
                  </Box>
                }
              />
            </ListItem>
            {index < options.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <EditDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false })}
        option={editDialog.option}
        onSave={handleSaveOption}
        title={editDialog.index !== undefined ? 'Edit Option' : 'Add Option'}
      />

      <SubItemEditDialog
        open={subItemDialog.open}
        onClose={() => setSubItemDialog({ ...subItemDialog, open: false })}
        currentValue={subItemDialog.currentValue}
        onSave={handleSaveSubItem}
        title={
          subItemDialog.itemIndex === options[subItemDialog.optionIndex]?.items?.length
            ? 'Add Item'
            : 'Edit Item'
        }
      />
    </Box>
  );
};

export default SubHeaderManager;
